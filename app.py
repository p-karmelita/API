from flask import Flask, request, jsonify
from sqlalchemy.orm import sessionmaker
import requests
import os
import uuid
from models import Profile, Wallet, engine, Dashboard

app = Flask(__name__)

# Database session configuration
Session = sessionmaker(bind=engine)

# Circle API configuration
CIRCLE_API_KEY = os.getenv('CircleAPI_KEY')  # Set in environment variables
CIRCLE_API_URL = "https://api.circle.com/v1"


@app.route('/sign_up', methods=['POST'])
def sign_up():
    """
    User registration endpoint with Circle API integration

    Expected JSON data:
    {
        "full_name": "John Doe",
        "email_address": "john@example.com",
        "wallet_address": "0x1234...",
        "notifications": ["Yes"],
        "language": ["English"]
    }
    """
    try:
        # Get data from request
        data = request.get_json()

        if not data:
            return jsonify({"error": "No data provided in request"}), 400

        # Validate required fields
        required_fields = ['full_name', 'email_address', 'wallet_address']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400

        # Create database session
        session = Session()

        try:
            # Check if user already exists
            existing_user = session.query(Profile).filter_by(
                full_name=data['full_name']
            ).first()

            if existing_user:
                session.close()
                return jsonify({"error": "User with this name already exists"}), 409

            # Check if email already exists
            existing_email = session.query(Profile).filter_by(
                email_address=data['email_address']
            ).first()

            if existing_email:
                session.close()
                return jsonify({"error": "This email address is already registered"}), 409

            # Register with Circle API
            circle_response = register_circle_wallet(
                email=data['email_address'],
                wallet_address=data['wallet_address']
            )

            if not circle_response.get('success'):
                session.close()
                return jsonify({
                    "error": "Circle API registration error",
                    "details": circle_response.get('error')
                }), 500

            # Create new profile
            new_profile = Profile(
                full_name=data['full_name'],
                email_address=data['email_address'],
                wallet_address=data['wallet_address'],
                notifications=data.get('notifications', ['Yes', 'No']),
                language=data.get('language', ['English', 'French', 'German']),
                disconnect=['Yes']
            )

            # Add to database
            session.add(new_profile)
            session.commit()

            response_data = {
                "success": True,
                "message": "User successfully registered",
                "user": {
                    "full_name": new_profile.full_name,
                    "email_address": new_profile.email_address,
                    "wallet_address": new_profile.wallet_address
                },
                "circle_data": circle_response.get('data')
            }

            session.close()
            return jsonify(response_data), 201

        except Exception as e:
            session.rollback()
            session.close()
            return jsonify({"error": f"Database error: {str(e)}"}), 500

    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500


def register_circle_wallet(email, wallet_address):
    """
    Register wallet with Circle API

    Args:
        email (str): User's email address
        wallet_address (str): Crypto wallet address

    Returns:
        dict: Response from Circle API
    """
    if not CIRCLE_API_KEY:
        return {
            "success": False,
            "error": "Circle API Key not configured"
        }

    headers = {
        "Authorization": f"Bearer {os.getenv('CircleAPI_KEY')}",
        "Content-Type": "application/json"
    }

    payload = {
        "idempotencyKey": f"{email}_{wallet_address}",
        "accountType": "individual",
        "metadata": {
            "email": email,
            "walletAddress": wallet_address
        }
    }

    try:
        # Call Circle API to create account
        response = requests.post(
            f"{CIRCLE_API_URL}/businessAccount/wallets/addresses/deposit",
            headers=headers,
            json=payload,
            timeout=10
        )

        if response.status_code in [200, 201]:
            return {
                "success": True,
                "data": response.json()
            }
        else:
            return {
                "success": False,
                "error": f"Circle API error: {response.status_code}",
                "details": response.text
            }

    except requests.exceptions.RequestException as e:
        return {
            "success": False,
            "error": f"Circle API connection error: {str(e)}"
        }


@app.route('/create_wallet', methods=['POST'])
def create_wallet():
    """
    Create wallet for user with Circle API integration

    Expected JSON data:
    {
        "user_email": "john@example.com",
        "blockchains": ["ARC-TESTNET"]
    }
    OR
    {
        "user_id": "John Doe",
        "blockchains": ["ETH-SEPOLIA", "MATIC-AMOY"]
    }
    """
    try:
        # Get data from request
        data = request.get_json()

        if not data:
            return jsonify({"error": "No data provided in request"}), 400

        # Get user identifier
        user_email = data.get('user_email')
        user_id = data.get('user_id')

        if not user_email and not user_id:
            return jsonify({
                "error": "Either user_email or user_id must be provided"
            }), 400

        # Get blockchains (default to ARC-TESTNET)
        blockchains = data.get('blockchains', ["ARC-TESTNET"])

        # Create database session
        session = Session()

        try:
            # Find user
            if user_email:
                user = session.query(Profile).filter_by(email_address=user_email).first()
            else:
                user = session.query(Profile).filter_by(full_name=user_id).first()

            if not user:
                session.close()
                return jsonify({"error": "User not found"}), 404

            # Check if wallet already exists for this user
            existing_wallet = session.query(Wallet).filter_by(
                user_email=user.email_address
            ).first()

            if existing_wallet:
                session.close()
                return jsonify({
                    "error": "Wallet already exists for this user",
                    "wallet_id": existing_wallet.wallet_id
                }), 409

            # Create wallet via Circle API
            circle_response = create_circle_wallet(
                user_email=user.email_address,
                blockchains=blockchains
            )

            if not circle_response.get('success'):
                session.close()
                return jsonify({
                    "error": "Failed to create wallet in Circle API",
                    "details": circle_response.get('error')
                }), 500

            # Extract wallet data from Circle response
            wallet_data = circle_response.get('data', {})
            wallet_id = wallet_data.get('id', str(uuid.uuid4()))
            wallet_address = wallet_data.get('address', user.wallet_address)

            # Create new wallet in database
            new_wallet = Wallet(
                wallet_id=wallet_id,
                user_email=user.email_address,
                wallet_address=wallet_address,
                balance=0.0,
                blockchains=blockchains,
                transaction_types=['rent', 'purchase', 'deposit', 'insurance', 'transfer'],
                status='active'
            )

            # Add to database
            session.add(new_wallet)
            session.commit()

            response_data = {
                "success": True,
                "message": "Wallet successfully created",
                "wallet": {
                    "wallet_id": new_wallet.wallet_id,
                    "wallet_address": new_wallet.wallet_address,
                    "user_email": new_wallet.user_email,
                    "balance": new_wallet.balance,
                    "blockchains": new_wallet.blockchains,
                    "status": new_wallet.status
                },
                "circle_data": wallet_data
            }

            session.close()
            return jsonify(response_data), 201

        except Exception as e:
            session.rollback()
            session.close()
            return jsonify({"error": f"Database error: {str(e)}"}), 500

    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500


def create_circle_wallet(user_email, blockchains):
    """
    Create wallet via Circle API

    Args:
        user_email (str): User's email address
        blockchains (list): List of blockchain networks

    Returns:
        dict: Response from Circle API
    """
    if not CIRCLE_API_KEY:
        return {
            "success": False,
            "error": "Circle API Key not configured"
        }

    headers = {
        "Authorization": f"Bearer {os.getenv('CircleAPI_KEY')}",
        "Content-Type": "application/json"
    }

    # Generate unique idempotency key
    idempotency_key = str(uuid.uuid4())

    payload = {
        "idempotencyKey": idempotency_key,
        "blockchains": blockchains,
        "metadata": {
            "email": user_email
        }
    }

    try:
        # Call Circle API to create wallet
        response = requests.post(
            f"{CIRCLE_API_URL}/w3s/user/wallets",
            headers=headers,
            json=payload,
            timeout=10
        )

        if response.status_code in [200, 201]:
            return {
                "success": True,
                "data": response.json().get('data', {})
            }
        else:
            return {
                "success": False,
                "error": f"Circle API error: {response.status_code}",
                "details": response.text
            }

    except requests.exceptions.RequestException as e:
        return {
            "success": False,
            "error": f"Circle API connection error: {str(e)}"
        }


@app.route('/wallet/<wallet_id>', methods=['GET'])
def get_wallet(wallet_id):
    """Get wallet information"""
    session = Session()
    try:
        wallet = session.query(Wallet).filter_by(wallet_id=wallet_id).first()
        if wallet:
            return jsonify({
                "wallet_id": wallet.wallet_id,
                "user_email": wallet.user_email,
                "wallet_address": wallet.wallet_address,
                "balance": wallet.balance,
                "blockchains": wallet.blockchains,
                "transaction_types": wallet.transaction_types,
                "status": wallet.status
            }), 200
        else:
            return jsonify({"error": "Wallet not found"}), 404
    finally:
        session.close()


@app.route('/send_payment', methods=['POST'])
def send_payment():
    """
    Send payment endpoint

    Expected JSON data:
    {
        "sender_email": "john@example.com",
        "recipient_address": "0xabcd...",
        "amount": 100,
        "note": "Rent payment for January",
        "type": "rent"
    }
    """
    try:
        # Get data from request
        data = request.get_json()

        if not data:
            return jsonify({"error": "No data provided in request"}), 400

        # Validate required fields
        required_fields = ['sender_email', 'recipient_address', 'amount']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400

        # Create database session
        session = Session()

        try:
            # Find sender's wallet
            wallet = session.query(Wallet).filter_by(
                user_email=data['sender_email']
            ).first()

            if not wallet:
                session.close()
                return jsonify({"error": "Sender wallet not found"}), 404

            # Check if sufficient balance
            if wallet.balance < data['amount']:
                session.close()
                return jsonify({
                    "error": "Insufficient balance",
                    "current_balance": wallet.balance,
                    "required": data['amount']
                }), 400

            # Validate transaction type
            valid_types = ['rent', 'purchase', 'deposit', 'insurance', 'transfer']
            transaction_type = data.get('type', 'transfer')
            if transaction_type not in valid_types:
                session.close()
                return jsonify({
                    "error": f"Invalid transaction type. Must be one of: {', '.join(valid_types)}"
                }), 400

            # Check if payment already exists (prevent duplicates)
            existing_payment = session.query(Dashboard).filter_by(
                recipient_address=data['recipient_address']
            ).first()

            if existing_payment:
                session.close()
                return jsonify({
                    "error": "Payment to this recipient already exists",
                    "payment_id": existing_payment.recipient_address
                }), 409

            # Create new payment record
            new_payment = Dashboard(
                recipient_address=data['recipient_address'],
                amount=data['amount'],
                note=data.get('note', ''),
                status=['pending'],
                transactions=['pending'],
                type=[transaction_type]
            )

            # Send payment via Circle API
            circle_response = send_circle_payment(
                sender_wallet=wallet.wallet_address,
                recipient_address=data['recipient_address'],
                amount=data['amount'],
                transaction_type=transaction_type
            )

            if circle_response.get('success'):
                # Update payment status
                new_payment.status = ['completed']
                new_payment.transactions = ['completed']

                # Update wallet balance
                wallet.balance -= data['amount']
            else:
                # Payment failed
                new_payment.status = ['failed']
                new_payment.transactions = ['failed']

            # Add to database
            session.add(new_payment)
            session.commit()

            response_data = {
                "success": circle_response.get('success', False),
                "message": "Payment processed",
                "payment": {
                    "recipient_address": new_payment.recipient_address,
                    "amount": new_payment.amount,
                    "note": new_payment.note,
                    "status": new_payment.status[0],
                    "type": new_payment.type[0]
                },
                "new_balance": wallet.balance,
                "circle_data": circle_response.get('data')
            }

            session.close()
            return jsonify(response_data), 201

        except Exception as e:
            session.rollback()
            session.close()
            return jsonify({"error": f"Database error: {str(e)}"}), 500

    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500


@app.route('/cancel_payment', methods=['POST'])
def cancel_payment():
    """
    Cancel payment endpoint

    Expected JSON data:
    {
        "recipient_address": "0xabcd..."
    }
    """
    try:
        data = request.get_json()

        if not data or 'recipient_address' not in data:
            return jsonify({"error": "recipient_address is required"}), 400

        session = Session()

        try:
            # Find payment
            payment = session.query(Dashboard).filter_by(
                recipient_address=data['recipient_address']
            ).first()

            if not payment:
                session.close()
                return jsonify({"error": "Payment not found"}), 404

            # Check if payment can be cancelled
            if payment.status[0] == 'completed':
                session.close()
                return jsonify({"error": "Cannot cancel completed payment"}), 400

            # Update payment status
            payment.status = ['cancelled']
            payment.transactions = ['cancelled']
            session.commit()

            response_data = {
                "success": True,
                "message": "Payment cancelled successfully",
                "payment": {
                    "recipient_address": payment.recipient_address,
                    "amount": payment.amount,
                    "status": payment.status[0]
                }
            }

            session.close()
            return jsonify(response_data), 200

        except Exception as e:
            session.rollback()
            session.close()
            return jsonify({"error": f"Database error: {str(e)}"}), 500

    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500


@app.route('/transactions', methods=['GET'])
def get_transactions():
    """
    Get transactions with optional filtering

    Query parameters:
    - user_email: Filter by sender email
    - status: Filter by status (all, completed, pending, failed, cancelled)
    - type: Filter by type (rent, purchase, deposit, insurance, transfer)
    """
    try:
        user_email = request.args.get('user_email')
        status_filter = request.args.get('status', 'all')
        type_filter = request.args.get('type')

        session = Session()

        try:
            # Get all payments
            query = session.query(Dashboard)

            # Apply filters
            if status_filter != 'all':
                # Note: This is simplified - you might want to join with Wallet table
                # to properly filter by user_email
                payments = query.all()
                filtered_payments = [
                    p for p in payments
                    if status_filter in p.transactions
                ]
            else:
                filtered_payments = query.all()

            # Filter by type if specified
            if type_filter:
                filtered_payments = [
                    p for p in filtered_payments
                    if type_filter in p.type
                ]

            # Build response
            transactions_list = []
            for payment in filtered_payments:
                transactions_list.append({
                    "recipient_address": payment.recipient_address,
                    "amount": payment.amount,
                    "note": payment.note,
                    "status": payment.status[0] if payment.status else 'unknown',
                    "transaction_status": payment.transactions[0] if payment.transactions else 'unknown',
                    "type": payment.type[0] if payment.type else 'unknown'
                })

            response_data = {
                "success": True,
                "count": len(transactions_list),
                "filters": {
                    "status": status_filter,
                    "type": type_filter
                },
                "transactions": transactions_list
            }

            session.close()
            return jsonify(response_data), 200

        except Exception as e:
            session.close()
            return jsonify({"error": f"Database error: {str(e)}"}), 500

    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500


@app.route('/profile/<identifier>', methods=['GET'])
def get_profile(identifier):
    """
    Get user profile by email or full name

    Returns profile with fields:
    - full_name
    - email_address
    - wallet_address
    - notifications
    - language
    - disconnect
    """
    try:
        session = Session()

        try:
            # Try to find by email first, then by full name
            user = session.query(Profile).filter_by(email_address=identifier).first()
            if not user:
                user = session.query(Profile).filter_by(full_name=identifier).first()

            if not user:
                session.close()
                return jsonify({"error": "Profile not found"}), 404

            # Get associated wallet
            wallet = session.query(Wallet).filter_by(user_email=user.email_address).first()

            response_data = {
                "success": True,
                "profile": {
                    "full_name": user.full_name,
                    "email_address": user.email_address,
                    "wallet_address": user.wallet_address,
                    "notifications": user.notifications,
                    "language": user.language,
                    "disconnect": user.disconnect
                },
                "wallet_info": {
                    "wallet_id": wallet.wallet_id if wallet else None,
                    "balance": wallet.balance if wallet else 0,
                    "status": wallet.status if wallet else None
                } if wallet else None
            }

            session.close()
            return jsonify(response_data), 200

        except Exception as e:
            session.close()
            return jsonify({"error": f"Database error: {str(e)}"}), 500

    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500


@app.route('/profile/update', methods=['PUT'])
def update_profile():
    """
    Update user profile

    Expected JSON data:
    {
        "email_address": "john@example.com",
        "full_name": "John Smith",  // optional
        "notifications": ["Yes"],  // optional
        "language": ["English"],  // optional
        "disconnect": ["No"]  // optional
    }
    """
    try:
        data = request.get_json()

        if not data or 'email_address' not in data:
            return jsonify({"error": "email_address is required"}), 400

        session = Session()

        try:
            # Find user
            user = session.query(Profile).filter_by(
                email_address=data['email_address']
            ).first()

            if not user:
                session.close()
                return jsonify({"error": "Profile not found"}), 404

            # Update fields if provided
            if 'full_name' in data:
                user.full_name = data['full_name']
            if 'notifications' in data:
                user.notifications = data['notifications']
            if 'language' in data:
                user.language = data['language']
            if 'disconnect' in data:
                user.disconnect = data['disconnect']

            session.commit()

            response_data = {
                "success": True,
                "message": "Profile updated successfully",
                "profile": {
                    "full_name": user.full_name,
                    "email_address": user.email_address,
                    "wallet_address": user.wallet_address,
                    "notifications": user.notifications,
                    "language": user.language,
                    "disconnect": user.disconnect
                }
            }

            session.close()
            return jsonify(response_data), 200

        except Exception as e:
            session.rollback()
            session.close()
            return jsonify({"error": f"Database error: {str(e)}"}), 500

    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500


def send_circle_payment(sender_wallet, recipient_address, amount, transaction_type):
    """
    Send payment via Circle API

    Args:
        sender_wallet (str): Sender's wallet address
        recipient_address (str): Recipient's wallet address
        amount (float): Amount to send
        transaction_type (str): Type of transaction

    Returns:
        dict: Response from Circle API
    """
    if not CIRCLE_API_KEY:
        return {
            "success": False,
            "error": "Circle API Key not configured"
        }

    headers = {
        "Authorization": f"Bearer {os.getenv('CircleAPI_KEY')}",
        "Content-Type": "application/json"
    }

    payload = {
        "idempotencyKey": str(uuid.uuid4()),
        "source": {
            "type": "wallet",
            "id": sender_wallet
        },
        "destination": {
            "type": "blockchain",
            "address": recipient_address
        },
        "amount": {
            "amount": str(amount),
            "currency": "USD"
        },
        "metadata": {
            "transactionType": transaction_type
        }
    }

    try:
        # Call Circle API to send payment
        response = requests.post(
            f"{CIRCLE_API_URL}/transfers",
            headers=headers,
            json=payload,
            timeout=10
        )

        if response.status_code in [200, 201]:
            return {
                "success": True,
                "data": response.json()
            }
        else:
            return {
                "success": False,
                "error": f"Circle API error: {response.status_code}",
                "details": response.text
            }

    except requests.exceptions.RequestException as e:
        return {
            "success": False,
            "error": f"Circle API connection error: {str(e)}"
        }


@app.route('/wallet/user/<user_email>', methods=['GET'])
def get_user_wallet(user_email):
    """Get wallet by user email"""
    session = Session()
    try:
        wallet = session.query(Wallet).filter_by(user_email=user_email).first()
        if wallet:
            return jsonify({
                "wallet_id": wallet.wallet_id,
                "user_email": wallet.user_email,
                "wallet_address": wallet.wallet_address,
                "balance": wallet.balance,
                "blockchains": wallet.blockchains,
                "transaction_types": wallet.transaction_types,
                "status": wallet.status
            }), 200
        else:
            return jsonify({"error": "Wallet not found for this user"}), 404
    finally:
        session.close()


# Additional endpoint to check user status
@app.route('/user/<full_name>', methods=['GET'])
def get_user(full_name):
    """Get user information"""
    session = Session()
    try:
        user = session.query(Profile).filter_by(full_name=full_name).first()
        if user:
            return jsonify({
                "full_name": user.full_name,
                "email_address": user.email_address,
                "wallet_address": user.wallet_address,
                "notifications": user.notifications,
                "language": user.language
            }), 200
        else:
            return jsonify({"error": "User not found"}), 404
    finally:
        session.close()


@app.route('/logout', methods=['POST'])
def logout():
    """
    User logout endpoint with Circle API session termination

    Expected JSON data:
    {
        "email_address": "john@example.com"
    }
    OR
    {
        "full_name": "John Doe"
    }
    """
    try:
        # Get data from request
        data = request.get_json()

        if not data:
            return jsonify({"error": "No data provided in request"}), 400

        # Check if email or full_name is provided
        email = data.get('email_address')
        full_name = data.get('full_name')

        if not email and not full_name:
            return jsonify({
                "error": "Either email_address or full_name must be provided"
            }), 400

        # Create database session
        session = Session()

        try:
            # Find user by email or full_name
            if email:
                user = session.query(Profile).filter_by(email_address=email).first()
            else:
                user = session.query(Profile).filter_by(full_name=full_name).first()

            if not user:
                session.close()
                return jsonify({"error": "User not found"}), 404

            # Terminate Circle API session
            circle_response = terminate_circle_session(
                email=user.email_address,
                wallet_address=user.wallet_address
            )

            # Update disconnect status
            user.disconnect = ['Yes']
            session.commit()

            response_data = {
                "success": True,
                "message": "User successfully logged out",
                "user": {
                    "full_name": user.full_name,
                    "email_address": user.email_address
                },
                "circle_logout": circle_response.get('success', False)
            }

            session.close()
            return jsonify(response_data), 200

        except Exception as e:
            session.rollback()
            session.close()
            return jsonify({"error": f"Database error: {str(e)}"}), 500

    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500


def terminate_circle_session(email, wallet_address):
    """
    Terminate Circle API session

    Args:
        email (str): User's email address
        wallet_address (str): Crypto wallet address

    Returns:
        dict: Response from Circle API
    """
    if not CIRCLE_API_KEY:
        return {
            "success": False,
            "error": "Circle API Key not configured"
        }

    headers = {
        "Authorization": f"Bearer {os.getenv('CircleAPI_KEY')}",
        "Content-Type": "application/json"
    }

    payload = {
        "email": email,
        "walletAddress": wallet_address,
        "action": "logout"
    }

    try:
        # Call Circle API to terminate session
        response = requests.post(
            f"{CIRCLE_API_URL}/businessAccount/sessions/terminate",
            headers=headers,
            json=payload,
            timeout=10
        )

        if response.status_code in [200, 201, 204]:
            return {
                "success": True,
                "message": "Circle session terminated successfully"
            }
        else:
            return {
                "success": False,
                "error": f"Circle API error: {response.status_code}",
                "details": response.text
            }

    except requests.exceptions.RequestException as e:
        return {
            "success": False,
            "error": f"Circle API connection error: {str(e)}"
        }


if __name__ == '__main__':
    app.run(debug=True)

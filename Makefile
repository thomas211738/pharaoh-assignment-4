# Define the virtual environment directory inside the backend folder
VENV_DIR = backend/venv

# Install dependencies
install:
	# Create virtual environment if it doesn't exist
	@if [ ! -d $(VENV_DIR) ]; then \
		python3 -m venv $(VENV_DIR); \
	fi
	# Upgrade pip, setuptools, and wheel
	@$(VENV_DIR)/bin/pip install --upgrade pip setuptools wheel
	# Install requirements
	@$(VENV_DIR)/bin/pip install -r backend/requirements.txt

# Run the Flask application and the frontend
run:
	# Start the Flask app in the background
	@$(VENV_DIR)/bin/python backend/app.py &
	cd frontend && npm run dev

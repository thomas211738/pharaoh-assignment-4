# Define the virtual environment directory inside the backend folder
VENV_DIR = backend/venv

# Install dependencies
install:
	cd frontend && npm install  # This line is fine as is
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
	@$(VENV_DIR)/bin/python backend/app.py & \
	PID=$$!; \
	sleep 5; \
	for i in {1..10}; do \
		if curl -s http://127.0.0.1:5000/; then \
			echo "Flask app is running"; \
			break; \
		fi; \
		echo "Flask app is not yet ready..."; \
		sleep 1; \
	done || { echo "Flask app failed to start"; kill $$PID; exit 1; } && \
	cd frontend && npm run dev



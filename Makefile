.PHONY: start stop install help db-start db-stop

help:
	@echo "Expense Tracking App - Available Commands"
	@echo "=========================================="
	@echo "  make start       - Start database, frontend and backend"
	@echo "  make stop        - Stop all services"
	@echo "  make install     - Install all dependencies"
	@echo "  make backend     - Start only backend"
	@echo "  make frontend    - Start only frontend"
	@echo "  make db-start    - Start PostgreSQL database"
	@echo "  make db-stop     - Stop PostgreSQL database"
	@echo "  make help        - Show this help message"

db-start:
	@echo "Checking PostgreSQL..."
	@brew services list | grep -q "postgresql@14" && \
	if pgrep -x "postgres" > /dev/null; then \
		echo "✓ PostgreSQL is already running"; \
	else \
		echo "Starting PostgreSQL..."; \
		brew services start postgresql@14; \
		echo "✓ PostgreSQL started"; \
	fi

db-stop:
	@echo "Stopping PostgreSQL..."
	@brew services stop postgresql@14 || true
	@echo "✓ PostgreSQL stopped"

start: db-start
	@echo "Starting Expense Tracker..."
	@echo "Backend starting on http://localhost:8000"
	@echo "Frontend starting on http://localhost:5173"
	@echo ""
	@echo "Run 'make stop' to stop all services"
	@echo ""
	@(eval "$$(pyenv init -)" && cd /Users/srikar/Documents/Projects/expense-tracking && pipenv run uvicorn app.main:app --reload) & \
	(cd /Users/srikar/Documents/Projects/expense-tracking/ui && npm run dev) & \
	wait

backend:
	@eval "$$(pyenv init -)" && cd /Users/srikar/Documents/Projects/expense-tracking && pipenv run uvicorn app.main:app --reload

frontend:
	@cd /Users/srikar/Documents/Projects/expense-tracking/ui && npm run dev

install:
	@echo "Installing backend dependencies..."
	@eval "$$(pyenv init -)" && cd /Users/srikar/Documents/Projects/expense-tracking && pipenv install
	@echo "Installing frontend dependencies..."
	@cd /Users/srikar/Documents/Projects/expense-tracking/ui && npm install
	@echo "All dependencies installed!"

stop:
	@echo "Stopping services..."
	@pkill -f "uvicorn" || true
	@pkill -f "vite" || true
	@pkill -f "npm" || true
	@echo "Services stopped!"
	@echo ""
	@read -p "Stop PostgreSQL database too? (y/n) " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		make db-stop; \
	fi

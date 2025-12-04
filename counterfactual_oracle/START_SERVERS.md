# How to Start the Servers

## Option 1: Use Batch Files (Easiest)

### Backend:
1. Open a terminal/command prompt
2. Navigate to: `counterfactual_oracle\backend`
3. Double-click `start_server.bat` OR run:
   ```
   start_server.bat
   ```

### Frontend:
1. Open a **NEW** terminal/command prompt
2. Navigate to: `counterfactual_oracle\frontend`
3. Double-click `start_frontend.bat` OR run:
   ```
   start_frontend.bat
   ```

## Option 2: Manual Commands

### Backend (Terminal 1):
```bash
cd counterfactual_oracle\backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### Frontend (Terminal 2):
```bash
cd counterfactual_oracle\frontend
npm run dev
```

## Verify Servers Are Running

1. **Backend**: Open http://127.0.0.1:8000/health in your browser
   - Should show: `{"status":"healthy"}`

2. **Frontend**: Open http://localhost:5173 in your browser
   - Should show the Counterfactual Financial Oracle homepage

3. **API Docs**: Open http://127.0.0.1:8000/docs
   - Should show Swagger UI with all API endpoints

## Troubleshooting

### "Port already in use" error:
- Kill the process: `netstat -ano | findstr :8000` then `taskkill /PID <pid> /F`
- Or use a different port: `--port 8001`

### "Module not found" error:
- Make sure you're in the `backend` directory
- Try: `python -m pip install -r requirements.txt`

### Frontend won't start:
- Make sure Node.js is installed: `node --version`
- Install dependencies: `npm install`
- Check if port 5173 is available

## Expected Output

### Backend should show:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### Frontend should show:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```



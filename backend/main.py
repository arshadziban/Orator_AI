from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import shutil
import os
import traceback
import tempfile
import uuid
from whisper_service import process_audio
from rewrite_service import rewrite_formal

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    file_path = None
    
    try:
        # Use absolute path in temp directory with a simple name
        temp_dir = tempfile.gettempdir()
        # Generate a unique filename to avoid conflicts
        file_ext = os.path.splitext(file.filename)[1] or ".wav"
        file_path = os.path.join(temp_dir, f"audio_{uuid.uuid4()}{file_ext}")

        print(f"\n{'='*60}")
        print(f"[STEP 1] Creating temp file")
        print(f"  Filename: {file.filename}")
        print(f"  Temp dir: {temp_dir}")
        print(f"  Full path: {file_path}")
        print(f"  Extension: {file_ext}")
        
        # Create temp directory if needed
        os.makedirs(temp_dir, exist_ok=True)
        print(f"  Temp dir exists: True")
        
        # Read file data
        print(f"\n[STEP 2] Reading file data from upload")
        content = await file.read()
        print(f"  File size: {len(content)} bytes")
        
        # Write to disk
        print(f"\n[STEP 3] Writing file to disk")
        with open(file_path, "wb") as buffer:
            buffer.write(content)
        print(f"  File written successfully")
        
        # Verify file exists
        print(f"\n[STEP 4] Verifying file")
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File was not created at {file_path}")
        
        print(f"  File exists: True")
        print(f"  File size on disk: {os.path.getsize(file_path)} bytes")
        print(f"  Readable: {os.access(file_path, os.R_OK)}")
        
        # Transcribe audio to text
        print(f"\n[STEP 5] Calling process_audio()")
        print(f"  Path being passed: {file_path}")
        original_text = process_audio(file_path)
        print(f"  ✓ Success")
        
        # Polish the text to formal English
        print(f"\n[STEP 6] Calling rewrite_formal()")
        formal_text = rewrite_formal(original_text)
        print(f"  ✓ Success")
        
        print(f"\n[SUCCESS] Processing complete")
        print(f"{'='*60}\n")

        return {
            "original_text": original_text,
            "formal_text": formal_text
        }
        
    except FileNotFoundError as e:
        error_msg = f"FileNotFoundError: {str(e)}"
        print(f"\n[ERROR] {error_msg}")
        print(f"  File path: {file_path}")
        if file_path and os.path.exists(file_path):
            print(f"  File exists: True (size: {os.path.getsize(file_path)} bytes)")
        else:
            print(f"  File exists: False")
        print(traceback.format_exc())
        print(f"{'='*60}\n")
        
        return JSONResponse(
            status_code=400,
            content={
                "error": error_msg,
                "detected_language": "unknown",
                "original_text": error_msg,
                "formal_english": error_msg
            }
        )
        
    except Exception as e:
        error_msg = f"{type(e).__name__}: {str(e)}"
        print(f"\n[ERROR] {error_msg}")
        print(f"  File path: {file_path}")
        print(traceback.format_exc())
        print(f"{'='*60}\n")
        
        return JSONResponse(
            status_code=400,
            content={
                "error": error_msg,
                "detected_language": "unknown",
                "original_text": error_msg,
                "formal_english": error_msg
            }
        )
    finally:
        # Clean up temp file
        if file_path and os.path.exists(file_path):
            try:
                os.remove(file_path)
                print(f"[CLEANUP] Removed: {file_path}\n")
            except Exception as e:
                print(f"[CLEANUP] Failed to remove {file_path}: {e}\n")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

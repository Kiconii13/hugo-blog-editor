from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import base64
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)
CORS(app)  # allow frontend (localhost:3000) to access the API

# GitHub configuration from environment variables
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")
REPO_OWNER = os.environ.get("REPO_OWNER")
REPO_NAME = os.environ.get("REPO_NAME")
BRANCH = os.environ.get("BRANCH", "main")
FOLDER_PATH = os.environ.get("FOLDER_PATH", "content/posts")

# Optional local save directory for debugging
LOCAL_SAVE_DIR = "content/posts"
if not os.path.exists(LOCAL_SAVE_DIR):
    os.makedirs(LOCAL_SAVE_DIR)


def github_put_file(path, content, commit_message):
    """
    Creates or updates a file on GitHub.
    Returns (success: bool, response_text: str)
    """
    url = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/contents/{path}"
    
    # Encode content to Base64 (GitHub API requirement)
    content_bytes = content.encode("utf-8")
    content_b64 = base64.b64encode(content_bytes).decode("utf-8")

    # Check if file already exists (to get SHA for update)
    r = requests.get(
        url,
        headers={"Authorization": f"token {GITHUB_TOKEN}", "Accept": "application/vnd.github.v3+json"}
    )
    sha = None
    if r.status_code == 200:
        sha = r.json().get("sha")

    # Build request payload for GitHub API
    data = {
        "message": commit_message,
        "content": content_b64,
        "branch": BRANCH
    }
    if sha:
        data["sha"] = sha  # required for updating existing file

    # Send PUT request to GitHub
    response = requests.put(
        url,
        json=data,
        headers={"Authorization": f"token {GITHUB_TOKEN}", "Accept": "application/vnd.github.v3+json"}
    )

    success = response.status_code in [200, 201]
    return success, response.text


@app.route("/save", methods=["POST"])
def save_post():
    """
    Accepts JSON containing slug, front matter, and markdown content.
    Saves file locally and uploads it to GitHub.
    """
    try:
        data = request.get_json()
        slug = data.get("slug")
        front = data.get("front")
        content = data.get("content")

        # Validate required fields
        if not slug or not front or not content:
            return jsonify({"error": "Missing data"}), 400

        # Combine front matter and markdown into one .md file
        full_content = front + "\n\n" + content
        filepath = f"{FOLDER_PATH}/{slug}.md"

        # Save file locally (optional debug)
        local_path = os.path.join(LOCAL_SAVE_DIR, f"{slug}.md")
        with open(local_path, "w", encoding="utf-8") as f:
            f.write(full_content)

        # Upload to GitHub
        success, response_text = github_put_file(filepath, full_content, f"Add/Update post {slug}")
        
        if success:
            return jsonify({
                "status": "ok",
                "message": "File uploaded to GitHub",
                "github_response": response_text
            }), 200
        else:
            return jsonify({
                "status": "error",
                "message": "Failed to upload to GitHub",
                "github_response": response_text
            }), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(port=5000, debug=True)  # start Flask server

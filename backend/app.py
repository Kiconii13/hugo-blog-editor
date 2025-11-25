from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import base64
import os
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app)

# GitHub configuration
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")
REPO_OWNER = os.environ.get("REPO_OWNER")
REPO_NAME = os.environ.get("REPO_NAME")
BRANCH = os.environ.get("BRANCH", "main")
FOLDER_PATH = os.environ.get("FOLDER_PATH", "content/posts")

# Local directories
LOCAL_SAVE_DIR = "content/posts"
IMAGES_DIR = "images/blogs"
os.makedirs(LOCAL_SAVE_DIR, exist_ok=True)
os.makedirs(IMAGES_DIR, exist_ok=True)

def github_put_file(path, content, commit_message, is_binary=False):
    """Uploads a file to GitHub, supports binary content."""
    url = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/contents/{path}"
    
    if is_binary:
        content_b64 = base64.b64encode(content).decode("utf-8")
    else:
        content_b64 = base64.b64encode(content.encode("utf-8")).decode("utf-8")

    # Check if file exists
    r = requests.get(
        url,
        headers={"Authorization": f"token {GITHUB_TOKEN}", "Accept": "application/vnd.github.v3+json"}
    )
    sha = r.json().get("sha") if r.status_code == 200 else None

    data = {"message": commit_message, "content": content_b64, "branch": BRANCH}
    if sha:
        data["sha"] = sha

    response = requests.put(
        url,
        json=data,
        headers={"Authorization": f"token {GITHUB_TOKEN}", "Accept": "application/vnd.github.v3+json"}
    )
    return response.status_code in [200, 201], response.text

@app.route("/save", methods=["POST"])
def save_post():
    """
    Saves a markdown post and optional PNG image.
    The image is uploaded to static/images/blogs in the repo.
    """
    try:
        data = request.get_json()
        slug = data.get("slug")
        front = data.get("front")
        content = data.get("content")
        image_base64 = data.get("image")  # Optional Base64 PNG

        if not slug or not front or not content:
            return jsonify({"error": "Missing data"}), 400

        # Save image if exists
        image_url_markdown = ""
        if image_base64:
            if not image_base64.startswith("data:image/png;base64,"):
                return jsonify({"error": "Only PNG images are allowed"}), 400
            header, encoded = image_base64.split(",", 1)
            image_bytes = base64.b64decode(encoded)
            
            # Local save
            local_image_path = os.path.join(IMAGES_DIR, f"{slug}.png")
            with open(local_image_path, "wb") as f:
                f.write(image_bytes)

            # Upload to GitHub
            github_image_path = f"static/images/blogs/{slug}.png"
            success, resp = github_put_file(github_image_path, image_bytes, f"Add image {slug}", is_binary=True)
            if not success:
                return jsonify({"error": "Failed to upload image to GitHub", "github_response": resp}), 500

            # Markdown link to image
            image_url_markdown = f"![{slug}](/static/images/blogs/{slug}.png)\n\n"

        # Combine front matter, image link, and markdown content
        full_content = front + "\n\n" + image_url_markdown + content

        # Save markdown locally
        local_md_path = os.path.join(LOCAL_SAVE_DIR, f"{slug}.md")
        with open(local_md_path, "w", encoding="utf-8") as f:
            f.write(full_content)

        # Upload markdown to GitHub
        github_md_path = f"{FOLDER_PATH}/{slug}.md"
        success, resp = github_put_file(github_md_path, full_content, f"Add/Update post {slug}")
        if not success:
            return jsonify({"error": "Failed to upload markdown to GitHub", "github_response": resp}), 500

        return jsonify({"status": "ok", "message": "Post and image uploaded successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    ADMIN_USER = os.environ.get("ADMIN_USER")
    ADMIN_PASS = os.environ.get("ADMIN_PASS")
    if username == ADMIN_USER and password == ADMIN_PASS:
        return jsonify({"success": True}), 200
    return jsonify({"success": False, "error": "Invalid credentials"}), 401

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))

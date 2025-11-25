# Hugo Blog Editor

A lightweight **React + Flask** application for creating, editing, and managing Hugo blog posts with live preview, metadata management, and GitHub integration.

## Features

- **Markdown editor** with live preview
- **Front matter editor** for title, description, tags, categories, date, draft status, and image
- **Image upload** directly to GitHub in `/static/images/blogs/`
- **Automatic slug generation** from post title
- **Login system** for restricted access
- **Save posts** to local filesystem and push directly to a GitHub repository
- **Responsive UI** built with React, styled for usability
- Footer with dynamic copyright year

## Tech Stack

- **Frontend:** React, JavaScript, CSS  
- **Backend:** Flask, Python, Flask-CORS  
- **Version Control:** GitHub (automatic push of posts and images)  
- **Environment Variables:** `.env` configuration for sensitive data  

## Installation

1. **Clone the repository:**

```bash
git clone https://github.com/Kiconii13/hugo-blog-editor.git
cd hugo-blog-editor
```

2. **Setup backend environment:**

```python
python -m venv venv
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate     # Windows
pip install -r requirements.txt
```

3. **Create a .env file with the following variables:**

GITHUB_TOKEN=your_github_personal_access_token
REPO_OWNER=your_github_username
REPO_NAME=your_repo_name
BRANCH=your_branch
FOLDER_PATH=content/posts
ADMIN_USER=your_admin_username
ADMIN_PASS=your_admin_password
PORT=5000

5. **Run the backend:**

```python
python app.py
```

5. **Setup frontend environment:**

```bash
cd frontend
npm install
npm start
```

The app will run on http://localhost:3000 and communicate with the Flask backend.

## Usage

1. Open the editor in your browser.
2. Login using your admin credentials.
3. Fill in the metadata and write your markdown content.
4. Upload an optional image (it will be saved in /static/images/blogs/).
5. Click Save to push the post to your GitHub repository and save it locally.

## Notes

- Images are saved in PNG format and automatically uploaded to GitHub.
- Front matter image field stores the path /static/images/blogs/<slug>.png to reference the uploaded image.
- Ensure your GitHub token has repo permissions for content upload.

## License

This project is licensed under the MIT License. See the LICENSE file for details.




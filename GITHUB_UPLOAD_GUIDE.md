# 📤 Upload Project to GitHub - Step by Step Guide

Your project is now committed locally! Follow these steps to upload it to GitHub.

## ✅ What's Already Done

- ✅ Git repository initialized
- ✅ `.gitignore` file created
- ✅ All files committed
- ✅ README.md added

## 🚀 Steps to Upload to GitHub

### Step 1: Create a GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Fill in the details:
   - **Repository name**: `Smart-Refrigerator` (or your preferred name)
   - **Description**: "Intelligent refrigerator management system with ESP32-CAM, YOLO detection, and React Native app"
   - **Visibility**: Choose Public or Private
   - **⚠️ DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click **"Create repository"**

### Step 2: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these:

```powershell
# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/Smart-Refrigerator.git

# Rename branch to main (GitHub's default)
git branch -M main

# Push to GitHub
git push -u origin main
```

### Alternative: Using SSH (if you have SSH keys set up)

```powershell
git remote add origin git@github.com:YOUR_USERNAME/Smart-Refrigerator.git
git branch -M main
git push -u origin main
```

### Step 3: Authenticate

- If using HTTPS, GitHub will prompt for authentication
- You may need a Personal Access Token instead of password
- To create a token: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)

## 🎯 Quick Copy-Paste Commands

**Replace `YOUR_USERNAME` with your actual GitHub username:**

```powershell
cd D:\LSM\Smart-Refrigerator
git remote add origin https://github.com/YOUR_USERNAME/Smart-Refrigerator.git
git branch -M main
git push -u origin main
```

## 🔍 Verify Upload

After pushing, refresh your GitHub repository page. You should see:
- ✅ All your files
- ✅ README.md displayed
- ✅ Commit history

## 📝 Next Steps (Optional)

### Add Repository Topics/Tags
On GitHub repository page:
1. Click the gear icon ⚙️ next to "About"
2. Add topics: `esp32`, `yolo`, `react-native`, `flask`, `iot`, `computer-vision`

### Add a License
If you want to add a license:
```powershell
# Download MIT License template (example)
# Or create LICENSE file manually on GitHub
```

## 🐛 Troubleshooting

### Error: "remote origin already exists"
```powershell
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/Smart-Refrigerator.git
```

### Error: Authentication failed
- Use Personal Access Token instead of password
- Or set up SSH keys for easier authentication

### Error: "failed to push some refs"
```powershell
git pull origin main --allow-unrelated-histories
git push -u origin main
```

## ✅ Success!

Once uploaded, your repository will be available at:
`https://github.com/YOUR_USERNAME/Smart-Refrigerator`

You can share this link with others, and they can clone it using:
```bash
git clone https://github.com/YOUR_USERNAME/Smart-Refrigerator.git
```

---

**Need help?** Check GitHub's documentation or open an issue on your repository.


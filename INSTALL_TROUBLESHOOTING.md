# Windows 安裝問題排除指南

## 問題 1: SSL 憑證驗證失敗

### 錯誤訊息
```
SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: unable to get local issuer certificate
```

### 原因
公司網路有 SSL 檢查、代理伺服器或防火牆政策

### 解決方案

#### 方案 A：設定公司代理（推薦）

詢問 IT 部門代理伺服器設定，然後執行：

```cmd
set HTTP_PROXY=http://proxy.company.com:8080
set HTTPS_PROXY=http://proxy.company.com:8080
pip install -r requirements-minimal-updated.txt
```

如果需要帳號密碼：
```cmd
set HTTP_PROXY=http://username:password@proxy.company.com:8080
set HTTPS_PROXY=http://username:password@proxy.company.com:8080
```

#### 方案 B：使用信任的網站（暫時方案）

```cmd
pip install --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host files.pythonhosted.org -r requirements-minimal-updated.txt
```

#### 方案 C：下載離線安裝檔

在有網路的電腦上下載：
```cmd
pip download -r requirements-minimal-updated.txt -d packages
```

將 `packages` 資料夾複製到公司電腦，然後：
```cmd
pip install --no-index --find-links=packages -r requirements-minimal-updated.txt
```

---

## 問題 2: Python 版本太新（3.14）

### 錯誤訊息
```
pydantic-core requires Rust compilation
```

### 原因
Python 3.14 太新，某些套件尚未提供預編譯版本

### 解決方案

#### 方案 A：使用更新的套件版本（推薦）

使用 `requirements-minimal-updated.txt` 而非 `requirements-minimal.txt`：

```cmd
pip install --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host files.pythonhosted.org -r requirements-minimal-updated.txt
```

#### 方案 B：降級至 Python 3.12（最穩定）

1. 解除安裝 Python 3.14
2. 下載安裝 Python 3.12：https://www.python.org/downloads/release/python-3120/
3. 重新建立虛擬環境：
   ```cmd
   python -m venv venv
   venv\Scripts\activate
   ```

#### 方案 C：使用 Anaconda

Anaconda 包含預編譯套件，避免編譯問題：

```cmd
conda create -n projecttracker python=3.12
conda activate projecttracker
pip install -r requirements-minimal-updated.txt
```

---

## 問題 3: 無法連接到 PyPI

### 解決方案：使用國內鏡像站

```cmd
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple -r requirements-minimal-updated.txt
```

或永久設定：
```cmd
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
```

其他鏡像選項：
- 清華大學：https://pypi.tuna.tsinghua.edu.cn/simple
- 阿里雲：https://mirrors.aliyun.com/pypi/simple/
- 中國科技大學：https://pypi.mirrors.ustc.edu.cn/simple/

---

## 完整安裝步驟（公司環境）

### 步驟 1：確認 Python 版本

```cmd
python --version
```

**建議使用 Python 3.12**（而非 3.14）

### 步驟 2：建立虛擬環境

```cmd
cd C:\Users\etsai4\project-tracker
python -m venv venv
venv\Scripts\activate
```

### 步驟 3：更新 pip

```cmd
python -m pip install --upgrade pip --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host files.pythonhosted.org
```

### 步驟 4：安裝相依套件（選擇一種方式）

**選項 A - 使用信任的主機：**
```cmd
pip install --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host files.pythonhosted.org -r requirements-minimal-updated.txt
```

**選項 B - 使用國內鏡像：**
```cmd
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple -r requirements-minimal-updated.txt
```

**選項 C - 只使用預編譯版本：**
```cmd
pip install --only-binary :all: --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host files.pythonhosted.org -r requirements-minimal-updated.txt
```

### 步驟 5：初始化資料庫

```cmd
python backend/init_db.py
```

### 步驟 6：測試後端

```cmd
uvicorn backend.main:app --reload
```

開啟瀏覽器前往：http://localhost:8000/docs

### 步驟 7：安裝前端（另一個視窗）

```cmd
cd frontend
npm install
npm run dev
```

---

## 快速診斷指令

```cmd
# 檢查 Python 版本
python --version

# 檢查 pip 版本
pip --version

# 檢查網路連線
ping pypi.org

# 檢查已安裝套件
pip list

# 測試代理設定
echo %HTTP_PROXY%
echo %HTTPS_PROXY%
```

---

## 仍然無法安裝？

### 最簡化方案：手動安裝核心套件

```cmd
# 逐一安裝，觀察哪個套件出問題
pip install --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host files.pythonhosted.org fastapi
pip install --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host files.pythonhosted.org uvicorn
pip install --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host files.pythonhosted.org aiosqlite
pip install --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host files.pythonhosted.org python-multipart
```

### 聯絡 IT 部門

準備以下資訊給 IT 部門：

1. **需要存取的網站：**
   - pypi.org
   - pypi.python.org
   - files.pythonhosted.org

2. **需求說明：**
   「需要從 Python Package Index (PyPI) 下載開源套件以執行內部專案管理系統」

3. **替代方案：**
   請 IT 部門協助設定正確的代理伺服器設定或 SSL 憑證

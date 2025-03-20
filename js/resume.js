/**
 * 个人简历表格交互功能
 */
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const resumeForm = document.getElementById('resumeForm');
    const photoInput = document.getElementById('photo');
    const photoLabel = document.getElementById('photoLabel');
    const photoPreview = document.getElementById('photoPreview');
    const saveBtn = document.getElementById('saveBtn');
    const printBtn = document.getElementById('printBtn');
    const resetBtn = document.getElementById('resetBtn');

    // 照片上传预览功能
    photoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // 确保上传的是图片文件
            if (!file.type.startsWith('image/')) {
                alert('请上传图片文件');
                return;
            }

            // 使用FileReader读取图片并预览
            const reader = new FileReader();
            reader.onload = function(e) {
                photoPreview.style.backgroundImage = `url(${e.target.result})`;
                photoPreview.style.display = 'block';
                photoLabel.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });

    // 表单提交功能
    resumeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 表单验证
        if (!validateForm()) {
            return;
        }

        // 收集表单数据
        const formData = new FormData(resumeForm);
        const resumeData = {};
        
        for (const [key, value] of formData.entries()) {
            // 排除文件类型
            if (key !== 'photo') {
                resumeData[key] = value;
            }
        }

        // 将数据保存到本地存储
        localStorage.setItem('resumeData', JSON.stringify(resumeData));
        alert('简历保存成功!');
    });

    // 表单验证函数
    function validateForm() {
        // 基本验证
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;

        if (!name.trim()) {
            alert('请填写姓名');
            return false;
        }

        // 手机号码验证
        if (phone.trim()) {
            const phoneRegex = /^1[3-9]\d{9}$/;
            if (!phoneRegex.test(phone)) {
                alert('请输入有效的11位手机号码');
                return false;
            }
        }

        // 邮箱验证
        if (email.trim()) {
            const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(email)) {
                alert('请输入有效的邮箱地址');
                return false;
            }
        }

        return true;
    }

    // 打印功能
    printBtn.addEventListener('click', function() {
        // 创建一个打印样式，隐藏按钮区域
        const style = document.createElement('style');
        style.innerHTML = `
            @media print {
                .button-group { display: none; }
                body { background-color: white; }
                .container { box-shadow: none; padding: 0; }
                input, select, textarea {
                    border: none;
                    background: transparent;
                    font-family: "Microsoft YaHei", sans-serif;
                }
            }
        `;
        document.head.appendChild(style);

        // 执行打印
        window.print();

        // 打印完成后移除样式
        setTimeout(() => {
            document.head.removeChild(style);
        }, 1000);
    });

    // 重置按钮功能
    resetBtn.addEventListener('click', function() {
        if (confirm('确定要重置所有信息吗？')) {
            // 重置表单
            resumeForm.reset();
            // 重置照片预览
            photoPreview.style.display = 'none';
            photoLabel.style.display = 'block';
            photoPreview.style.backgroundImage = 'none';
        }
    });

    // 加载本地存储的数据（如果有）
    function loadSavedData() {
        const savedData = localStorage.getItem('resumeData');
        if (savedData) {
            const data = JSON.parse(savedData);
            
            // 填充表单字段
            for (const key in data) {
                const element = document.getElementById(key);
                if (element) {
                    element.value = data[key];
                }
            }
        }
    }

    // 尝试加载已保存的数据
    loadSavedData();
}); 
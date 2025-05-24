/**
 * 创建基础对话框HTML结构
 */
function createDialogBase() {
    if (!document.getElementById('dialog-styles')) {
        const style = document.createElement('style');
        style.id = 'dialog-styles';
        style.textContent = `
        /* 提示和确认对话框 */
        .alert-dialog, .confirm-dialog {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 20001;
          user-select: none;
        }
        
        .alert-content, .confirm-content {
          background-color: var(--color-bg-primary);
          padding: var(--spacing-xxl);
          border-radius: var(--radius-xl);
          width: 90%;
          max-width: 400px;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }
        
        .alert-message, .confirm-message {
          color: var(--color-text-primary);
          font-size: 16px;
          line-height: 1.5;
          white-space: pre-wrap;
        }
        
        .alert-buttons, .confirm-buttons {
          display: flex;
          justify-content: flex-end;
          gap: var(--spacing-sm);
        }
        
        .alert-buttons button, .confirm-buttons button {
          padding: var(--spacing-sm) var(--spacing-lg);
          border: none;
          border-radius: var(--radius-md);
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }
        
        .alert-confirm, .confirm-ok {
          background-color: var(--color-primary);
          color: var(--color-bg-primary);
        }
        
        .alert-confirm:hover, .confirm-ok:hover {
          background-color: var(--color-primary-dark);
        }
        
        .confirm-cancel {
          background-color: var(--color-bg-secondary);
          color: var(--color-text-primary);
        }
        
        .confirm-cancel:hover {
          background-color: var(--color-border);
        }
      `;
        document.head.appendChild(style);
    }
}

/**
 * 显示提示框
 * @param {string} message 提示消息
 * @param {string} [title] 标题
 * @returns {Promise<void>}
 */
function showAlert(message, title) {
    return new Promise((resolve) => {
        createDialogBase();

        // 移除已存在的对话框
        const existing = document.querySelector('.alert-dialog');
        if (existing) existing.remove();

        const dialog = document.createElement('div');
        dialog.className = 'alert-dialog';

        dialog.innerHTML = `
        <div class="alert-content">
          ${title ? `<h3>${title}</h3>` : ''}
          <div class="alert-message">${message}</div>
          <div class="alert-buttons">
            <button class="alert-confirm">确定</button>
          </div>
        </div>
      `;

        document.body.appendChild(dialog);

        dialog.querySelector('.alert-confirm').addEventListener('click', () => {
            dialog.remove();
            resolve();
        });
    });
}
/*
使用示例：
showAlert('操作成功!').then(() => {
    console.log('用户关闭了提示框');
});
*/

/**
 * 显示确认框
 * @param {string} message 确认消息
 * @param {string} [title] 标题
 * @returns {Promise<boolean>} 用户是否确认
 */
function showConfirm(message, title) {
    return new Promise((resolve) => {
        createDialogBase();

        // 移除已存在的对话框
        const existing = document.querySelector('.confirm-dialog');
        if (existing) existing.remove();

        const dialog = document.createElement('div');
        dialog.className = 'confirm-dialog';

        dialog.innerHTML = `
        <div class="confirm-content">
          ${title ? `<h3>${title}</h3>` : ''}
          <div class="confirm-message">${message}</div>
          <div class="confirm-buttons">
            <button class="confirm-cancel">取消</button>
            <button class="confirm-ok">确定</button>
          </div>
        </div>
      `;

        document.body.appendChild(dialog);

        dialog.querySelector('.confirm-cancel').addEventListener('click', () => {
            dialog.remove();
            resolve(false);
        });

        dialog.querySelector('.confirm-ok').addEventListener('click', () => {
            dialog.remove();
            resolve(true);
        });
    });
}
/*
使用示例：
showConfirm('确定要删除此项吗?').then((confirmed) => {
    if (confirmed) {
        console.log('用户确认');
    } else {
        console.log('用户取消');
    }
});
*/

// 导出函数
export {
    showAlert,
    showConfirm
};
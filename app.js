// ローカルストレージからデータを取得
let balance = parseFloat(localStorage.getItem('balance')) || 0;
const transactionHistory = JSON.parse(localStorage.getItem('transactionHistory')) || [];

// htmlのインプットフォームから入力値を取得
function addTransaction() {
  const type = document.querySelector('#type').value;
  const amount = parseFloat(document.querySelector('#amount').value);
  const date = document.querySelector('#date').value;
  const memo = document.querySelector('#memo').value;

  // 金額が数値でない、且つ、日付が入力されていない場合にエラーメッセージを出す
  if (isNaN(amount) || date === '') {
    alert('金額と日付を正しく入力してください');
    return; //関数をここで終了させる
  }

  // 新しいリストアイテムを作成
  const listItem = document.createElement('li');

  // 取引の種類に応じて残高を更新し、リストアイテムのテキストカラーを設定
  if (type === '支出') {
    balance -= amount;
    listItem.style.color = 'red';
  } else {
    balance += amount;
    listItem.style.color = 'green';
  }

  // 取引情報を整形し、リストアイテムのテキストとして設定
  const formattedDate = new Date(date).toLocaleDateString(); // 現地の日付を取得するメソッド
  listItem.textContent = `${type}: ${amount}円 - ${formattedDate} - ${memo}`;

  // 削除ボタンを作成し、クリック時のイベントを設定
  const deleteButton = document.createElement('button');
  deleteButton.textContent = '削除';
  deleteButton.onclick = function () {
    deleteTransaction(transactionHistory.indexOf(listItem.textContent), listItem);
  };

  // リストアイテムに削除ボタンを追加し、それを取引履歴の要素に追加
  listItem.appendChild(deleteButton);
  document.querySelector('#transaction-history').appendChild(listItem);

  // 取引履歴に新しい取引情報を追加し、更新された残高と取引履歴をローカルストレージに保存
  transactionHistory.push(listItem.textContent);
  localStorage.setItem('balance', balance.toString());
  localStorage.setItem('transactionHistory', JSON.stringify(transactionHistory));

  updateBalance();

}

// 残高のアップデート
function updateBalance() {
  const balanceElement = document.querySelector('#balance');
  balanceElement.textContent = `${balance}円`;
}

// 初回ロード時に履歴を表示
function loadTransactionHistory() {
  const transactionHistoryElement = document.querySelector('#transaction-history');

  // 既存の履歴をクリア
  transactionHistoryElement.innerHTML = '';

  transactionHistory.forEach((transaction, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = transaction;

    // 削除ボタンの作成とクリックイベントの追加
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '削除';
    deleteButton.onclick = function () {
      deleteTransaction(index, listItem);
    };

    listItem.appendChild(deleteButton);
    transactionHistoryElement.appendChild(listItem);
  });
}

// リセットボタンをクリックした時の処理
function resetHistory() {
  const confirmReset = confirm('本当に履歴をリセットしますか？これにより残高もリセットされます。');
  if (confirmReset === true) {
    balance = 0;
    transactionHistory.length = 0;
    localStorage.setItem('balance', balance.toString());
    localStorage.setItem('transactionHistory', JSON.stringify(transactionHistory));
    loadTransactionHistory();
    updateBalance();
  }
}

// 削除ボタンをクリックしたときの処理
function deleteTransaction(index, listItem) {
  const confirmDelete = confirm('本当にこの履歴を削除しますか？');
  if(confirmDelete === true) {
    const transactionData = listItem.textContent.split(' - ');
    const type = transactionData[0].includes('支出') ? '支出' : '収入';
    const amount = parseFloat(transactionData[0].match(/[-]?[0-9]*\.?[0-9]+/g)[0]);

    // 残高の更新
    if(type === '支出') {
      balance -= amount;
    } else {
      balance += amount;
    }

    // 履歴の削除
    transactionHistory.splice(index,1);
    // ローカルストレージの更新
    localStorage.setItem('balance', balance.toString());
    localStorage.setItem('transactionHistory', JSON.stringify(transactionHistory));
    // 履歴を再表示
    loadTransactionHistory();
    // 残高の更新
    updateBalance();
  }
}

// 初回ロード時にデータを反映
loadTransactionHistory();
updateBalance();
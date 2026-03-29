const STORAGE_KEY = 'todo_items';
let items = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
let filter = 'all';

const input    = document.getElementById('input');
const addBtn   = document.getElementById('addBtn');
const list     = document.getElementById('list');
const stats    = document.getElementById('stats');
const count    = document.getElementById('countLabel');
const clearBtn = document.getElementById('clearBtn');

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function render() {
  const visible = items.filter(it =>
    filter === 'all'    ? true :
    filter === 'active' ? !it.done :
                          it.done
  );

  list.innerHTML = '';

  visible.forEach(it => {
    const li = document.createElement('li');
    li.className = 'item' + (it.done ? ' done' : '');
    li.dataset.id = it.id;

    const check = document.createElement('div');
    check.className = 'check';
    check.title = it.done ? '标记未完成' : '标记完成';
    check.addEventListener('click', () => toggle(it.id));

    const span = document.createElement('span');
    span.className = 'text';
    span.textContent = it.text;
    span.contentEditable = true;
    span.spellcheck = false;
    span.addEventListener('blur', e => {
      const newText = e.target.textContent.trim();
      if (newText) { it.text = newText; save(); }
      else { e.target.textContent = it.text; }
    });
    span.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); span.blur(); }
    });

    const del = document.createElement('button');
    del.className = 'del';
    del.title = '删除';
    del.textContent = '×';
    del.addEventListener('click', () => remove(it.id));

    li.append(check, span, del);
    list.appendChild(li);
  });

  const pending = items.filter(i => !i.done).length;
  stats.textContent = pending === 0 && items.length > 0
    ? '所有任务已完成!'
    : `${pending} 个任务待完成`;
  count.textContent = `共 ${items.length} 条`;
  clearBtn.disabled = !items.some(i => i.done);
}

function addItem() {
  const text = input.value.trim();
  if (!text) return;
  items.unshift({ id: Date.now(), text, done: false });
  input.value = '';
  save();
  render();
}

function toggle(id) {
  const it = items.find(i => i.id === id);
  if (it) { it.done = !it.done; save(); render(); }
}

function remove(id) {
  items = items.filter(i => i.id !== id);
  save();
  render();
}

addBtn.addEventListener('click', addItem);
input.addEventListener('keydown', e => { if (e.key === 'Enter') addItem(); });

document.querySelectorAll('.filters button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filters button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filter = btn.dataset.filter;
    render();
  });
});

clearBtn.addEventListener('click', () => {
  items = items.filter(i => !i.done);
  save();
  render();
});

render();

const input = document.querySelector('.todo-input');
const addBtn = document.querySelector('.add-todo');
const list = document.querySelector('.list-todo');

const app = {

    listJobs: [],

    listTodo() {
        return JSON.parse(this.takeDataFromLocalStorage()) ?? []
    },

    // Lấy dữ liệu từ localStorage
    takeDataFromLocalStorage() {
        const storageJobs = localStorage.getItem('jobs')
        return storageJobs
    },

    addTodo(job) {
        this.listJobs.push(job)
        const newJobs = this.listJobs
        const jsonJobs = JSON.stringify(newJobs)
        localStorage.setItem('jobs', jsonJobs)
        this.listTodo()
    },

    delete(index) {
        this.listJobs.splice(index, 1)
        const newJobs = this.listJobs
        const jsonJobs = JSON.stringify(newJobs)
        localStorage.setItem('jobs', jsonJobs)
        this.listTodo()
    },

    handlePressEnter(e) {
        if(e.key === 'Enter') {
            if(input.value !== '') {
                this.addTodo(input.value)
                this.render()
    
                input.value = ''
                input.focus()
            }
        }
    },

    handleAdd() {
        const job = input.value
        if(job !== '') {
            this.addTodo(job)
            this.render()

            input.value = ''
            input.focus()
        }
    },

    handleClick(e) {
        const deleteBtn = e.target.closest('.icon-delete')
        if(deleteBtn) {
            const index = deleteBtn.dataset.index
            if(index) {
                this.delete(index)
                this.render()
            }
        }

        const todoItem = e.target.closest('.todo-item')
        if(todoItem) {
            todoItem.classList.toggle('pass')
        }
    },

    render() {
        let htmls = this.listTodo().map((todo, index) => {
            return `
                <li class="todo-item">
                    <span class="todo-name">${index + 1}. ${todo}</span>    
                    <i class="icon-delete fa-solid fa-trash" data-index=${index}></i>
                </li>
            `
        }).join('')
        document.querySelector('.list-todo').innerHTML = htmls
    },

    init() {

        //Handle Dom events
        input.onkeypress = this.handlePressEnter.bind(this)
        list.onclick = this.handleClick.bind(this)
        addBtn.onclick = this.handleAdd.bind(this)

        this.render()
    }

}

app.init()
const data = Array.from({length: 100})
    .map((_, i) => `<div class="item">Item${i + 1}</div>`)

/* function populateList() {
    
    const list = document.querySelector('#paginate .list')
    list.innerHTML = data.join("")

    return data
} */

const html = {
    get(element) {
        return document.querySelector(element)
    }
}

let perPage = 10

const state = {
    page: 1,
    perPage,
    totalPage: Math.ceil(data.length / perPage),
    maxVisibleButtons: 5
}

const control = {
    next() {
        state.page++
        const lastPage= state.page > state.totalPage
        if(lastPage) {
            state.page--
        }
    },
    prev() {
        state.page--

        if(state.page < 1) {
            state.page++
        }
    }, 
    goTo(page) {

        if (page == 1){page = 1}

        state.page = +page

        if(page > state.totalPage) {
            state.page = state.totalPage
        }
    }, 
    createListeners() {
        html.get('.first').addEventListener('click', () => {
            control.goTo(1)
            update()
        })
            
        html.get('.last').addEventListener('click', () => {
            control.goTo(state.totalPage)
            update()
        })
            
        html.get('.next').addEventListener('click', () => {
            control.next()
            update()
        })

        html.get('.prev').addEventListener('click', () => {
            control.prev()
            update()
        })
    }
}

const list = {
    create(item) {
        const div = document.createElement('div')
        div.classList.add('item')
        div.innerHTML = item

        html.get('.list').appendChild(div)
    },
    update() {
        html.get('.list').innerHTML = ""

        let page = state.page - 1
        let start = page * state.perPage
        let end = start + state.perPage

        const paginatedItems = data.slice(start, end)

        paginatedItems.forEach(list.create )
    }
}

const buttons = {
    element: html.get('.pagination .numbers'),

    create(number) {
        const button = document.createElement('div')

        button.innerHTML = number

        if(state.page == number) {
            button.classList.add('active')
        }

        button.addEventListener('click', (event) => {
            const page = event.target.innerText

            control.goTo(page)
            update()
        })

        buttons.element.appendChild(button)
    },

    update() {
        buttons.element.innerHTML = ""
        const { maxLeft, maxRight } = buttons.calculateMaxVisible()

        for(let page = maxLeft; page <= maxRight; page++) {
            buttons.create(page)
        }
        
    },

    calculateMaxVisible() {

        const { maxVisibleButtons } = state
        let maxLeft = (state.page - Math.floor(maxVisibleButtons / 2))
        let maxRight = (state.page + Math.floor(maxVisibleButtons / 2))

        if(maxLeft < 1) {
            maxLeft = 1
            maxLeft = maxVisibleButtons
        }

        if(maxRight > state.totalPage) {
            maxRight = state.totalPage - (maxVisibleButtons - 1)
            maxRight = state.totalPage

            if(maxLeft < 1) maxLeft = 1
        }

        
        return { maxLeft, maxRight}
    }
}

function update() {
    list.update()
    buttons.update()
}

function init() {
    update()
    control.createListeners()
}

init()

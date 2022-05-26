let addBtn = document.querySelector('.add-btn')
let modalCont = document.querySelector('.modal-cont')
let mainCont = document.querySelector('.main-cont')


let colors = ['red', 'green', 'yellow', 'black']

let modalPriorityColor = colors[colors.length - 1]
let allPriorityColors = document.querySelectorAll('.priority-color')


let addFlag = false
let textAreaCont = document.querySelector('.textarea-cont')
let removeBtn = document.querySelector('.remove-btn')
let removeFlag = false

let lockClass = 'fa-lock'
let unlockClass = 'fa-lock-open'
let toolBoxColors = document.querySelectorAll('.color')
let ticketArr = []// for storing all tickets as object


// localStorage get all tickets 
if (localStorage.getItem('tickets')) {
    ticketArr = JSON.parse(localStorage.getItem('tickets'))
    ticketArr.forEach(function (ticketObj) {
        createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketId)
    })
}


// filter tickets wrt colors 
for (let i = 0; i < toolBoxColors.length; i++) {
    toolBoxColors[i].addEventListener('click', function (e) {
        let currentToolBoxColor = toolBoxColors[i].classList[1]
        let filteredTickets = ticketArr.filter(function (ticketObj) {
            return currentToolBoxColor === ticketObj.ticketColor
        })
        // console.log(filteredTickets)
        // remove previous tickets 
        let allTickets = document.querySelectorAll('.ticket-cont')

        for (let i = 0; i < allTickets.length; i++) {
            allTickets[i].remove()
        }
        //add filtered tickets
        filteredTickets.forEach(function (filteredObj) {
            createTicket(filteredObj.ticketColor, filteredObj.ticketTask, filteredObj.ticketId)
        })

    })
    toolBoxColors[i].addEventListener('dblclick', function (e) {
        let allTickets = document.querySelectorAll('.ticket-cont')

        for (let i = 0; i < allTickets.length; i++) {
            allTickets[i].remove()
        }
        ticketArr.forEach(function (ticketObj) {
            createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketId)
        })
    })
}




addBtn.addEventListener('click', function (e) {
    //display modal

    //addFlag== true => modal display
    //addFlag== false => modal hide
    addFlag = !addFlag
    if (addFlag) {
        modalCont.style.display = 'flex'
    }
    else {
        modalCont.style.display = 'none'
    }
    // add a card 
})

// changing priority colors 
allPriorityColors.forEach(function (colorElement) {
    colorElement.addEventListener('click', function (e) {
        allPriorityColors.forEach(function (prioirtyColorElement) {
            prioirtyColorElement.classList.remove('active')
        })

        colorElement.classList.add('active')
        modalPriorityColor = colorElement.classList[0]
    })
})

// generating a ticket
modalCont.addEventListener('keydown', function (e) {
    let key = e.key
    if (key == 'Shift') {
        createTicket(modalPriorityColor, textAreaCont.value)//function to generate the ticket
        modalCont.style.display = 'none'
        addFlag = false
        textAreaCont.value = ''

    }
})


function createTicket(ticketColor, ticketTask, ticketId) {
    let id = ticketId || shortid()
    let ticketCont = document.createElement('div')
    ticketCont.setAttribute('class', 'ticket-cont')
    ticketCont.innerHTML = `<div class="ticket-color ${ticketColor}"></div>
    <div class="ticket-id">#${id}</div>
    <div class="task-area">${ticketTask}</div>
    <div class="ticket-lock">
        <i class="fa-solid fa-lock"></i>
    </div>
                            `
    mainCont.appendChild(ticketCont)
    handleRemoval(ticketCont, id)
    handleLock(ticketCont,id)

    handleColor(ticketCont,id)//need to change this



    if (!ticketId) {
        ticketArr.push({
            ticketColor,
            ticketTask,
            ticketId: id
        })
        localStorage.setItem('tickets', JSON.stringify(ticketArr))//*********** LOCAL STORAGE*********** */

    }
}


removeBtn.addEventListener('click', function (e) {
    removeFlag = !removeFlag

    if (removeFlag == true) {
        removeBtn.style.color = 'red'
    }
    else {
        removeBtn.style.color = 'black'
    }

})
// remove tickets function 
function handleRemoval(ticket, id) {
    ticket.addEventListener('click', function () {
        if (!removeFlag) return
        let idx = getTicketIdx(id)
        console.log(idx)

        // local storage rempval of ticket
        ticketArr.splice(idx, 1)// basically worked as removal
        let stringTicketArray = JSON.stringify(ticketArr)
        localStorage.setItem('tickets', stringTicketArray)
        ticket.remove() //ui removal


    })
}


// lock and unlock tickets
function handleLock(ticket, id) {
    let ticketLockElement = ticket.querySelector('.ticket-lock')

    let ticketLock = ticketLockElement.children[0]
    let ticketTaskArea = ticket.querySelector('.task-area')

    ticketLock.addEventListener('click', function (e) {
        let ticketIdx=getTicketIdx(id)
        if (ticketLock.classList.contains(lockClass)) {
            ticketLock.classList.remove(lockClass)
            ticketLock.classList.add(unlockClass)
            ticketTaskArea.setAttribute('contenteditable', 'true')

        }
        else {

            ticketLock.classList.remove(unlockClass)
            ticketLock.classList.add(lockClass)
            ticketTaskArea.setAttribute('contenteditable', 'false')

        }
        ticketArr[ticketIdx].ticketTask=ticketTaskArea.innerText
        localStorage.setItem('tickets',JSON.stringify(ticketArr))

    })
}


function handleColor(ticket,id) {
    let ticketColorStrip = ticket.querySelector('.ticket-color')

    ticketColorStrip.addEventListener('click', function (e) {
        let currentTicketColor = ticketColorStrip.classList[1]
        
        let ticketIdx= getTicketIdx(id)
        console.log(ticketIdx)

        let currentTicketColorIndex = colors.findIndex(function (color) {
            return currentTicketColor === color
        })
        currentTicketColorIndex++
        let newTicketColorIndex = currentTicketColorIndex % colors.length
        let newTicketColor = colors[newTicketColorIndex]
        ticketColorStrip.classList.remove(currentTicketColor)
        ticketColorStrip.classList.add(newTicketColor)


        //modify ticket color in local storage
        ticketArr[ticketIdx].ticketColor=newTicketColor
        localStorage.setItem('tickets',JSON.stringify(ticketArr))


    })
}
function getTicketIdx(id) {
    let ticketIdx = ticketArr.findIndex(function(ticketObj){
        return ticketObj.ticketId === id
}) 

return ticketIdx
}
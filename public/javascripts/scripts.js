const USER_ENDPOINT = 'https://randomuser.me'
const DATA_ENDPOINT = 'http://localhost:3000'
const htmlResponse = document.querySelector('#sellers')
const htmlSellers = document.querySelector('#sellerNumbers')
const canvas = document.querySelector('#statistics')
const ctx = canvas.getContext('2d')
const defaultColor = 'rgba(34, 51, 51, 0.2)'

var userData = {statistics: null, user: null}
var statisticInfo = {labels: [], money: [], quantity: [], type: 'bar', index: -1, isMoney: false}
var userQuantity = -1
var myChart = null

document.addEventListener('DOMContentLoaded', initApp)

function setStatisticsType(type) {
    switch (type) {
        case 0: statisticInfo.type = 'bar'
        break
        case 1: statisticInfo.type = 'line'
            break
        case 2: statisticInfo.type = 'doughnut'
            break
    }
    if (statisticInfo.index === -1) return
    setStatistics()

}

function initApp() {
    setTimeout(setData, 5000)
    setData()
    clearCanvas()
    setStatisticsType()
    document.getElementById('#bar').addEventListener('click',
        e=> { setStatisticsType(0) }
        , false)
    document.getElementById('#linear').addEventListener('click',
        e=> { setStatisticsType(1) }
        , false)
    document.getElementById('#pie').addEventListener('click',
        e=> { setStatisticsType(2) }
        , false)
}

async function setData() {
    const xhr = new XMLHttpRequest()
    xhr.addEventListener('load', onRequestStatisticsHandler)
    xhr.open('GET', `${DATA_ENDPOINT}/getStatistics`)
    xhr.send()
}

function getUserData() {
    const xhr = new XMLHttpRequest()
    xhr.addEventListener('load', onRequestLoadHandler)
    xhr.open('GET', `${USER_ENDPOINT}/api/?results=${userQuantity}`)
    xhr.send()
}


function onRequestLoadHandler() {
    if (this.readyState !== 4 || this.status !== 200)
        return
    userData.user = JSON.parse(this.response).results
    htmlResponse.innerHTML = userData.user.map(
        (user) => `<li class="collection-item avatar">
                        <img src="${user.picture.thumbnail}" alt="Sellers Image" class="circle">
                        <span class="title">${user.name.first} ${user.name.last}</span>
                        <p>${user.location.city}<br>
                        </p>
                        <a href="#" id="${user.login.uuid}"  class="secondary-content ${user.login.uuid}">Ver</a>
                    </li>`
    )
    statisticInfo.labels = []
    statisticInfo.money = []
    statisticInfo.quantity = []
    var temp = ''
    for (let i = 0; i < userQuantity; i++) {
        addClickListener(userData.user[i], userData.statistics[i], i)
        statisticInfo.labels.push(userData.user[i].name.first)
        temp = userData.statistics[i].dinero
        statisticInfo.money.push(parseFloat( temp.substring(2,temp.length) ))
        statisticInfo.quantity.push(parseInt(userData.statistics[i].cantidad))
    }
}

function onRequestStatisticsHandler() {
    if (this.readyState !== 4 || this.status !== 200)
        return;
    userData.statistics = JSON.parse(this.response).result

    //Generate User Info
    if (userQuantity === userData.statistics.length)
        return
    userQuantity = userData.statistics.length
    getUserData()
}

function addClickListener(user, statistics, position) {
    document.getElementById(user.login.uuid).addEventListener("click",
        e => {
        clearCanvas()
            document.getElementById('sellerInfo').innerHTML = `<div class="card-image">
                    <img src="${user.picture.large}" alt="User Picture">
                </div>
                <div class="card-stacked card-info">
                    <span><b>Nombre:</b> ${user.name.first} ${user.name.last}</span>
                    <span><b>Correo:</b> ${user.email}</span>
                    <span><b>Teléfono:</b> ${user.cell}</span>
                    <span><b>País:</b> ${user.location.city}, ${user.location.country}</span>
                </div>`

            htmlSellers.innerHTML = `<div class="card-content white-text"><span class="card-title">Productividad de ${user.name.first}</span>
                                        <p>
                                            <span><b>Autos vendidos:</b> ${statistics.cantidad}</span><br/>
                                            <span><b>Ingresos generados:</b> ${statistics.dinero}</span>
                                        </p>
                                     </div>
                                     <div class="card-action"><b>Ver gráfico por: </b><a href="#" id="${user.login.uuid}Quantity">Cantidad</a><a href="#" id="${user.login.uuid}Money">Dinero</a></div>`

            document.getElementById(`${user.login.uuid}Quantity`).addEventListener("click",
                event => {
                    statisticInfo.isMoney = false
                    statisticInfo.index = position
                    setStatistics()
                },false)

            document.getElementById(`${user.login.uuid}Money`).addEventListener("click",
                event => {
                    statisticInfo.isMoney = true
                    statisticInfo.index = position
                    setStatistics(position,true)
                },false)

        }, false)
}

function clearCanvas() {
    ctx.fillStyle = 'white'
    ctx.fillRect(0,0, canvas.width, canvas.height)
    if (myChart !== null) myChart.destroy()

}

function  setStatistics() {
    console.log(statisticInfo)
    if (myChart !== null) myChart.destroy()

    let colors = []
    for (let i = 0; i < userQuantity; i++) {
        colors.push(`rgba(${rand(230)}, ${rand(230)}, ${rand(230)}, 0.4)`)
    }


    colors[statisticInfo.index] = 'rgba(50, 50, 255, 1)'
    myChart = new Chart(ctx, {
        type: statisticInfo.type,
        data: {
            labels: statisticInfo.labels,
            datasets: [{
                label: statisticInfo.isMoney? 'Ingresos generados' : 'Carros vendidos',
                data: statisticInfo.isMoney? statisticInfo.money : statisticInfo.quantity,
                backgroundColor: colors,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: statisticInfo.isMoney
                }
            }
        }
    })
}

function rand(max) {
    return Math.floor(Math.random() * max) + 101;
}
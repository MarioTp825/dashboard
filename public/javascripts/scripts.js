const USER_ENDPOINT = 'https://randomuser.me'
const xhr = new XMLHttpRequest()
var userData = null

xhr.addEventListener('load', onRequestLoadHandler)
xhr.open('GET', `${USER_ENDPOINT}/api/?results=5`)
xhr.send()

function onRequestLoadHandler() {
    if (this.readyState === 4 && this.status === 200) {
        userData = JSON.parse(this.response).results
        const htmlResponse = document.querySelector('#sellers')
        htmlResponse.innerHTML = userData.map(
            (user) => `<li class="collection-item avatar">
                        <img src="${user.picture.thumbnail}" alt="Sellers Image" class="circle">
                        <span class="title">${user.name.first} ${user.name.last}</span>
                        <p>${user.location.country}<br>
                        </p>
                        <a href="#" onClick="setUser('${user.login.uuid}')"  class="secondary-content"><i class="material-icons">Ver</i></a>
                    </li>`
        )
    }
}

function main (){
    loadQuotes()
    formListener()
    mainEventListener()
}

function formListener(){
    const newQuotForm = document.querySelector("#new-quote-form")

    newQuotForm.addEventListener('submit', function(event){
        event.preventDefault()

        const newQuote = {
            quote: event.target['quote'].value,
            author: event.target['author'].value,
            // likes: []
        }

        const reqObj = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              "Accept": "application/json"
            },
            body: JSON.stringify(newQuote)
          }

        fetch("http://localhost:3000/quotes?_embed=likes", reqObj)
        .then(resp => resp.json())
        .then(quote => {
            event.target.reset()
            const updateQuote = {
                ...quote, 
                likes : []
            }
            addQuoteToPage(updateQuote)
        })
    })
}
//------------------------------------------------------------------------------------------

function mainEventListener(){
    const quoteList = document.querySelector("#quote-list")
    //debugger
    quoteList.addEventListener('click', function(event){
        if(event.target.className === 'btn-danger'){
            deleteQuoteFromPage(event)
        } else if(event.target.className === 'btn-success'){
            addLikeToPage(event)
        }
    })

}


function addLikeToPage(event){
    const quoteId = parseInt(event.target.id) 

    //debugger

    const reqObj = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Accept": "application/json"
        },
        body: JSON.stringify({
            quoteId : quoteId
        })
      }

      fetch('http://localhost:3000/likes', reqObj)
      .then(resp => resp.json())
      .then(data => {
          const span = event.target.firstElementChild
          span.innerText = parseInt(span.innerText) + 1 
          //console.log(data)
      })


}


function deleteQuoteFromPage(event){
 
    const quoteId = event.target.id 

    fetch(`http://localhost:3000/quotes/${quoteId}`, {method: 'DELETE'})
    .then(resp => resp.json())
    .then(data => {
        event.target.parentNode.parentNode.remove()
    })
}



function loadQuotes(){
    fetch("http://localhost:3000/quotes?_embed=likes")
    .then(resp => resp.json())
    .then(quotes => {
        quotes.forEach(function(quote){
            addQuoteToPage(quote)
        })
    })
} 

function addQuoteToPage(quote){
    const ul = document.querySelector("#quote-list")

    const li = document.createElement("li")
    li.className = "quote-card"
    ul.appendChild(li)

    const blockquote = document.createElement("blockquote")
    blockquote.className = "blockquote"
    li.appendChild(blockquote)

    const p = document.createElement("p")
    p.className = "mb-0"
    p.innerText = `${quote.quote}`
    blockquote.appendChild(p)

    const author = document.createElement("footer")
    author.className = "blockquote-footer"
    author.innerText = `${quote.author}`
    blockquote.appendChild(author)

    const br = document.createElement("br")
    blockquote.appendChild(br)

    const likesBtn = document.createElement('button')
    likesBtn.className = "btn-success"
    likesBtn.innerHTML = `Likes: <span>${quote.likes.length}</span>`
    likesBtn.id = quote.id
    blockquote.appendChild(likesBtn)

    const deleteBtn = document.createElement('button')
    deleteBtn.className = "btn-danger"
    deleteBtn.id = quote.id
    deleteBtn.innerText = "Delete"
    blockquote.appendChild(deleteBtn)

}



main()

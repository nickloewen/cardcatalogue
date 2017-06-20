document.getElementById('sort').addEventListener('change', function () { loadPage() })
document.getElementById('contributors').addEventListener('change', function () { loadPage() })

function loadPage (element) {
  console.log(element)

  var sortElement = document.getElementById('sort')
  var sort = sortElement.options[sortElement.selectedIndex].value

  var cEl = document.getElementById('contributors')
  var contributor = cEl.options[cEl.selectedIndex].value

  var url = location.protocol + '//' + location.host + location.pathname
  window.location.href = url + '?sort=' + sort + '&contributor=' + contributor
}

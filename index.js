const { fromEvent } = rxjs;
const { map, mergeAll, mergeMap, debounceTime, filter, distinctUntilChanged } =
  rxjs.operators;
const { ajax } = rxjs.ajax;

const $layer = document.getElementById('suggest-layer');

const user$ = fromEvent(document.getElementById('search'), 'keyup').pipe(
  debounceTime(500),
  map((event) => event.target.value),
  distinctUntilChanged(),
  filter((query) => query.trim().length > 0),
  map((query) =>
    ajax.getJSON(`https://api.github.com/search/users?q=${query}`)
  ),
  mergeAll()
);

user$.subscribe((e) => {
  drawLayer(e.items);
});

function drawLayer(items) {
  $layer.innerHTML = items
    .map((user) => {
      return `<li class="user">
                <img src="${user.avatar_url}" width="50px" height="50px" />
                <p><a href="${user.html_url}" target="_blank">${user.login}</a></p>
            
            </li>`;
    })
    .join('');
}

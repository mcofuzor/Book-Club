// document.querySelector('#admin-login-form').addEventListener('submit', function(e) {
//     e.preventDefault();
//     const form = e.target;
//     const formData = new FormData(form);
//     console.log(formData.get('username'), formData.get('pass'));
//     fetch('/adminlog', {method: 'POST', body: formData})
//     .then(res => res.json())
//     .then(data => {
//         // Handle response, e.g. show error or redirect
//         if (data.error) {
//             document.querySelector('.welcome').textContent = data.error;
//         } else {
//             window.location.href = data.redirect || '/admin';
//         }
//     });
// });



// window.addEventListener('DOMContentLoaded', function  () {
//   fetch('/clear-error', { method: 'POST' })
//     .then(res => res.json())
//     .then(() => {
//       const msg = document.querySelector('.welcome');
//       if (msg) msg.textContent = '';
//     });
// });

// document.getElementsByClassName('details')[0].addEventListener('submit', function (event) {
//   event.preventDefault();
// });

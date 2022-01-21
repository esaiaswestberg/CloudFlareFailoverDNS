const timeline = document.querySelector('.timeline');
for (let i = 0; i < 50; i++) {
	const item = document.createElement('span');
	item.classList.add('timeline-item');
	item.setAttribute('status', Math.random() >= 0.5 ? 'main' : 'backup');
	timeline.appendChild(item);
}

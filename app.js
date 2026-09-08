const revealItems = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: 0.12 });
revealItems.forEach((item) => observer.observe(item));

const numberObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (!entry.isIntersecting) return;
  entry.target.querySelectorAll('[data-count]').forEach((number) => {
    const target = Number(number.dataset.count); const suffix = target > 10 ? '+' : '년+'; const started = performance.now();
    const tick = (now) => { const progress = Math.min((now - started) / 1200, 1); const value = Math.floor((1 - Math.pow(1 - progress, 3)) * target); number.textContent = value.toLocaleString('ko-KR') + suffix; if (progress < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });
  numberObserver.unobserve(entry.target);
}), { threshold: 0.45 });
const numberSection = document.querySelector('.numbers'); if (numberSection) numberObserver.observe(numberSection);

document.querySelector('.inquiry-form')?.addEventListener('submit', (event) => {
  event.preventDefault(); const data = new FormData(event.currentTarget); const subject = encodeURIComponent('[강의 문의] ' + (data.get('organization') || '')); const body = encodeURIComponent(`기관명/단체명: ${data.get('organization')}\n담당자: ${data.get('contact')}\n희망 교육 주제: ${data.get('topic')}\n교육 대상·일정: ${data.get('details')}`); window.location.href = `mailto:ssopark2202@gmail.com?subject=${subject}&body=${body}`;
});

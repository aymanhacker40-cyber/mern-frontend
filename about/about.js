

  const counters = [
    { id: 'users', end: 1500 },
    { id: 'destinations', end: 120 },
    { id: 'bookings', end: 3200 },
    { id: 'experts', end: 25 }
  ];

  const duration = 2000; // مدة العد الكاملة لكل العدادات بالمللي ثانية
  const frameRate = 60; // عدد التحديثات في الثانية
  const totalFrames = Math.round((duration / 1000) * frameRate);

  counters.forEach(counter => {
    let element = document.getElementById(counter.id);
    let current = 0;
    let increment = counter.end / totalFrames;
    let frame = 0;

    let timer = setInterval(() => {
      frame++;
      current += increment;
      if (frame >= totalFrames) {
        element.textContent = counter.end; // يوصل للقيمة النهائية بالضبط
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current);
      }
    }, 1000 / frameRate);
  });




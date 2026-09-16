const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

menuButton?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.site-nav a').forEach(link => {
  link.addEventListener('click', () => {
    nav?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});

const page = document.body.dataset.page;
if (page) {
  const active = document.querySelector(`[data-nav="${page}"]`);
  active?.classList.add('active');
}

function initHeroGlobe() {
  const canvas = document.getElementById('heroGlobeCanvas');
  if (!canvas || !window.d3 || !window.topojson) return;

  const context = canvas.getContext('2d');
  const projection = d3.geoOrthographic().clipAngle(90).precision(0.4);
  const path = d3.geoPath(projection, context);
  const graticule = d3.geoGraticule10();

  const defaultNode = {
    lat: 31.7619,
    lon: -106.4850,
    label: 'Peregrine node'
  };

  const state = {
    width: 0,
    height: 0,
    scale: 1,
    rotation: [106, -28, 0],
    isDragging: false,
    lastInteraction: Date.now(),
    userNode: { ...defaultNode },
    worldLand: null,
    worldBorders: null,
    usStates: null,
    usNation: null,
    tracks: [
      { coords: [[-122.33, 47.60], [-106.48, 31.76], [-97.04, 32.90], [-77.04, 38.90]], color: '#37d8ff' },
      { coords: [[-117.16, 32.72], [-111.89, 40.76], [-104.99, 39.74], [-95.37, 29.76]], color: '#8cf970' },
      { coords: [[-80.19, 25.76], [-87.62, 41.88], [-118.24, 34.05]], color: '#ffb347' }
    ],
    points: [
      { lat: 47.60, lon: -122.33, color: '#37d8ff' },
      { lat: 32.90, lon: -97.04, color: '#8cf970' },
      { lat: 38.90, lon: -77.04, color: '#ffb347' },
      { lat: 29.76, lon: -95.37, color: '#f972c3' }
    ]
  };

  function render() {
    context.clearRect(0, 0, state.width, state.height);

    context.save();
    context.beginPath();
    path({ type: 'Sphere' });
    context.fillStyle = '#07141e';
    context.fill();
    context.restore();

    context.save();
    context.beginPath();
    path(graticule);
    context.strokeStyle = 'rgba(71, 164, 215, 0.18)';
    context.lineWidth = 0.8;
    context.stroke();
    context.restore();

    if (state.worldLand) {
      context.save();
      context.beginPath();
      path(state.worldLand);
      context.fillStyle = '#0f2230';
      context.fill();
      context.restore();
    }

    if (state.worldBorders) {
      context.save();
      context.beginPath();
      path(state.worldBorders);
      context.strokeStyle = 'rgba(111, 214, 255, 0.55)';
      context.lineWidth = 1;
      context.stroke();
      context.restore();
    }

    if (state.usNation) {
      context.save();
      context.beginPath();
      path(state.usNation);
      context.strokeStyle = 'rgba(111, 214, 255, 0.65)';
      context.lineWidth = 1.1;
      context.stroke();
      context.restore();
    }

    if (state.usStates) {
      context.save();
      context.beginPath();
      path(state.usStates);
      context.strokeStyle = 'rgba(111, 214, 255, 0.25)';
      context.lineWidth = 0.8;
      context.stroke();
      context.restore();
    }

    state.tracks.forEach(track => {
      context.save();
      context.beginPath();
      path({ type: 'LineString', coordinates: track.coords });
      context.strokeStyle = track.color;
      context.lineWidth = 1.4;
      context.globalAlpha = 0.85;
      context.stroke();
      context.restore();
    });

    state.points.forEach(point => {
      const projected = projection([point.lon, point.lat]);
      if (!projected) return;
      context.save();
      context.beginPath();
      context.arc(projected[0], projected[1], 4, 0, Math.PI * 2);
      context.fillStyle = point.color;
      context.shadowColor = point.color;
      context.shadowBlur = 16;
      context.fill();
      context.restore();
    });

    const projected = projection([state.userNode.lon, state.userNode.lat]);
    if (projected) {
      context.save();
      context.beginPath();
      context.arc(projected[0], projected[1], 5, 0, Math.PI * 2);
      context.fillStyle = '#6ef2ff';
      context.shadowColor = '#6ef2ff';
      context.shadowBlur = 18;
      context.fill();

      context.beginPath();
      context.arc(projected[0], projected[1], 12, 0, Math.PI * 2);
      context.strokeStyle = 'rgba(110, 242, 255, 0.6)';
      context.lineWidth = 1.2;
      context.stroke();

      context.font = '12px "JetBrains Mono", monospace';
      context.fillStyle = '#d9fbff';
      context.fillText(state.userNode.label, projected[0] + 14, projected[1] - 10);
      context.restore();
    }

    context.save();
    context.beginPath();
    path({ type: 'Sphere' });
    context.strokeStyle = 'rgba(78, 212, 255, 0.78)';
    context.lineWidth = 1.4;
    context.stroke();
    context.restore();
  }

  function resize() {
    const bounds = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    state.width = Math.max(320, Math.floor(bounds.width));
    state.height = Math.max(320, Math.floor(bounds.height));
    canvas.width = Math.floor(state.width * dpr);
    canvas.height = Math.floor(state.height * dpr);
    canvas.style.width = `${state.width}px`;
    canvas.style.height = `${state.height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    projection
      .translate([state.width * 0.64, state.height * 0.54])
      .scale(Math.min(state.width, state.height) * 0.45 * state.scale)
      .rotate(state.rotation);
    render();
  }

  function tick() {
    if (!state.isDragging && Date.now() - state.lastInteraction > 1400) {
      state.rotation = [state.rotation[0] + 0.08, state.rotation[1], state.rotation[2]];
      projection.rotate(state.rotation);
      render();
    }
    requestAnimationFrame(tick);
  }

  d3.select(canvas)
    .call(
      d3.drag()
        .on('start', () => {
          state.isDragging = true;
          state.lastInteraction = Date.now();
        })
        .on('drag', event => {
          state.rotation = [
            state.rotation[0] + event.dx * 0.25,
            Math.max(-45, Math.min(45, state.rotation[1] - event.dy * 0.25)),
            state.rotation[2]
          ];
          projection.rotate(state.rotation);
          state.lastInteraction = Date.now();
          render();
        })
        .on('end', () => {
          state.isDragging = false;
          state.lastInteraction = Date.now();
        })
    )
    .call(
      d3.zoom()
        .scaleExtent([0.82, 1.85])
        .on('zoom', event => {
          state.scale = event.transform.k;
          resize();
          state.lastInteraction = Date.now();
        })
    );

  Promise.all([
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(res => res.json()),
    fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json').then(res => res.json())
  ]).then(([world, us]) => {
    state.worldLand = topojson.feature(world, world.objects.land);
    state.worldBorders = topojson.mesh(world, world.objects.countries, (a, b) => a !== b);
    state.usNation = topojson.feature(us, us.objects.nation);
    state.usStates = topojson.mesh(us, us.objects.states, (a, b) => a !== b);
    resize();
    render();
    requestAnimationFrame(tick);
  }).catch(() => resize());

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        state.userNode = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          label: 'Visitor node'
        };
        state.rotation = [-state.userNode.lon, -state.userNode.lat, 0];
        projection.rotate(state.rotation);
        state.lastInteraction = Date.now();
        render();
      },
      () => {
        state.userNode = { ...defaultNode };
      },
      { enableHighAccuracy: false, timeout: 4000, maximumAge: 600000 }
    );
  }

  window.addEventListener('resize', resize);
  resize();
}

initHeroGlobe();

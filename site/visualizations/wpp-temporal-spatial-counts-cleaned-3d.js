// 3D (Plotly) companion to wpp-temporal-spatial-counts-cleaned.vl.json: same data and
// color/size coding, but instead of a WPP-table dropdown the organ system is the z axis.
//
// Usage (see wpp-temporal-spatial-counts-cleaned-3d.html): load plotly.js 3 + d3-dsv,
// then call wppTemporalSpatial3d('#vis'). Most tweaks are values in the SPEC below.
//
// NOTES FOR FUTURE TWEAKS
// - Axis tick labels: Plotly's built-in 3D tick labels are all hidden. x/y labels are
//   rotated and centered over the grid, and z labels are always put on whichever
//   vertical edge Plotly picks (the left one in our view). Instead, all tick labels are
//   scatter3d text traces pinned to fixed cube edges (see xLabelTrace etc.). Trade-off:
//   if the user rotates far enough, those edges (and labels) can end up behind the cube.
// - Axis titles: x/y use Plotly's titles; z ("Organ System") is a scene annotation,
//   since 3D text can't be rotated but annotations can (textangle).
// - Title padding: Plotly has no option for the gap between 3D tick labels and axis
//   titles, so padAxisTitles() sets an internal gl-axes value (labelPad). It relies on
//   Plotly internals (gd._fullLayout.scene._scene), so re-check after Plotly upgrades;
//   if it breaks, it no-ops and x/y titles just sit closer to the axis.
// - Fonts: 3D text is rasterized to a canvas once, so the Metropolis web font must be
//   loaded before plotting (fontsLoaded), or labels silently use a fallback font.
// - Legends: the colorbar is Plotly's; the size legend and the shared vertical
//   "Number of Processes" title are absolutely positioned HTML, placed from the
//   colorbar's and the "Organ System" annotation's rendered positions after every redraw
//   (positionLegends). The colorbar + size legend block is vertically centered.
// - Page centering: the cube sits left of center in the 800x600 plot and the legends
//   stick out to the right, so the HTML shifts .container left by a measured 110px.
//   Re-measure if the plot size, camera, or legend layout changes.
// - Things that did NOT work for centering: camera.center (warps the perspective) and a
//   narrower scene.domain (clips the WebGL canvas, cutting off long z labels).
// - Visual checks: headless Chrome with WebGL via SwiftShader renders this correctly,
//   e.g. serve this directory with `python3 -m http.server 8765`, then run
//   chrome-headless-shell --no-sandbox --use-angle=swiftshader --enable-unsafe-swiftshader
//     --window-size=1100,800 --virtual-time-budget=15000 --screenshot=out.png
//     http://localhost:8765/wpp-temporal-spatial-counts-cleaned-3d.html

const WPP_TEMPORAL_SPATIAL_3D_SPEC = {
  dataUrl:
    'https://cdn.wholepersonphysiome.org/data-products/reports/validation/wpp-temporal-spatial-counts-cleaned.csv',
  font: 'Metropolis',
  titleColor: '#201E3D',
  labelColor: '#4B4B5E',
  // Axis domains give the tick order (first value at the low end of the axis). Rows
  // whose value isn't in the domain are dropped, as with vega-lite's explicit domains
  // (e.g. the "Organism" spatial scale).
  x: {
    field: 'effector_scale',
    title: 'Spatial Scale',
    domain: ['Body', 'Organ system', 'Organ', 'Tissue', 'FTU', 'Cell'],
  },
  y: {
    field: 'time_scale',
    title: 'Time Scale',
    domain: [
      '<1 second',
      '1s - < 1min',
      '1min - < 1hr',
      '1hr - < 1day',
      '1day - < 1week',
      '1week - < 1year',
      '1year or longer',
    ],
  },
  z: {
    field: 'table',
    title: 'Organ System',
    domain: null, // null = all tables in the data, sorted alphabetically
    reverse: false, // true = first value at the top of the axis
    include: (t) => !/homeostasis/i.test(t), // organ systems only
    labelExpr: (t) =>
      t
        .replace(/-/g, ' ')
        .replace(/\bsystem\b/gi, '')
        .trim(),
  },
  value: {
    field: 'process_count',
    title: 'Number of Processes',
    domain: [0, 150], // clamped, as in the vega-lite spec
    legendValues: [50, 100, 150],
  },
  camera: { eye: { x: 2.0, y: -2.0, z: 1.6 } },
  aspectratio: { x: 1, y: 1, z: 1.2 },
  // Internal gl-axes labelPad (see padAxisTitles). Indexed by x/y/z *direction*, not by
  // axis: each axis title is offset along the two directions perpendicular to it, so
  // the x title uses [1] and [2], the y title [0] and [2]. Plotly's default is 30.
  axisTitlePad: [85, 85, 50],
  // Gray back panes (slightly different shade per wall) so the circles stand out
  paneColors: { x: '#ebebeb', y: '#e6e6e6', z: '#f0f0f0' },
  gridColor: '#c4c4c4',
  mark: {
    maxDiameter: 45,
    minDiameter: 3.75,
    stroke: '#808080',
    strokeWidth: 0.5,
    fillOpacity: 0.7,
  },
  legend: {
    colorbarLen: 0.4, // fraction of plot height
    gap: 16, // px between colorbar and size legend
    titleGap: 24, // px between the legends and their shared title
  },
  // d3 / vega "yellowgreen" (YlGn) scheme
  reverseColors: true, // true = green at 0, yellow at the max
  colorscale: [
    [0.0, '#ffffe5'],
    [0.125, '#f7fcb9'],
    [0.25, '#d9f0a3'],
    [0.375, '#addd8e'],
    [0.5, '#78c679'],
    [0.625, '#41ab5d'],
    [0.75, '#238443'],
    [0.875, '#006837'],
    [1.0, '#004529'],
  ],
};

function wppTemporalSpatial3d(selector, spec = WPP_TEMPORAL_SPATIAL_3D_SPEC) {
  const el = document.querySelector(selector);
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const [vmin, vmax] = spec.value.domain;
  const clamp = (v) => Math.max(vmin, Math.min(vmax, v));
  // Area-proportional sizing (like vega-lite's size channel), returned as a diameter
  const diameter = (v) =>
    Math.max(spec.mark.minDiameter, spec.mark.maxDiameter * Math.sqrt((clamp(v) - vmin) / (vmax - vmin)));

  const domainFor = (enc, rows) => {
    const domain = (enc.domain ?? [...new Set(rows.map((r) => r[enc.field]))].sort()).filter(
      (v) => !enc.include || enc.include(v),
    );
    return enc.reverse ? [...domain].reverse() : domain;
  };
  const label = (enc, v) => capitalize(enc.labelExpr ? enc.labelExpr(v) : v);

  // Categories are plotted at integer positions 0..n-1 (Plotly 3D has no band scales)
  const axis = (enc, domain, pane) => ({
    title: { text: enc.title, font: { size: 14, color: spec.titleColor } },
    showticklabels: false, // drawn by the text traces instead (see notes at top)
    tickmode: 'array',
    tickvals: domain.map((_, i) => i),
    range: [-0.5, domain.length - 0.5],
    gridcolor: spec.gridColor,
    showbackground: true,
    backgroundcolor: spec.paneColors[pane],
  });

  // See notes at top: sets Plotly's internal 3D axis-title padding
  const padAxisTitles = (gd) => {
    const scene = gd._fullLayout?.scene?._scene;
    if (!scene?.axesOptions || !scene.glplot) {
      return;
    }
    scene.axesOptions.labelPad = spec.axisTitlePad;
    scene.glplot.axes.update(scene.axesOptions);
    scene.glplot.redraw();
  };

  const sizeLegendRowHeight = spec.mark.maxDiameter + 6;
  const sizeLegendHeight = sizeLegendRowHeight * spec.value.legendValues.length;

  // Untitled: it shares the title drawn by renderLegendTitle with the colorbar
  const renderSizeLegend = () => {
    const legend = document.createElement('div');
    legend.className = 'size-legend';
    legend.style.position = 'absolute';
    const r = spec.mark.maxDiameter / 2;
    legend.innerHTML = `<svg width="${spec.mark.maxDiameter + 60}" height="${sizeLegendHeight}">
      ${spec.value.legendValues
        .map((v, i) => {
          const cy = i * sizeLegendRowHeight + sizeLegendRowHeight / 2;
          return `<circle cx="${r + 2}" cy="${cy}" r="${diameter(v) / 2}" fill="white"
              stroke="${spec.mark.stroke}" stroke-width="1"></circle>
            <text x="${spec.mark.maxDiameter + 10}" y="${cy}" dominant-baseline="middle"
              font-size="14" font-weight="500" fill="${spec.labelColor}">${v}</text>`;
        })
        .join('')}
    </svg>`;
    el.parentElement.appendChild(legend);
    return legend;
  };

  // One vertical title shared by the colorbar and size legend, reading bottom to top
  // like the "Organ System" title
  const renderLegendTitle = () => {
    const title = document.createElement('div');
    title.className = 'legend-title';
    title.textContent = spec.value.title;
    Object.assign(title.style, {
      position: 'absolute',
      writingMode: 'vertical-rl',
      transform: 'rotate(180deg)',
      whiteSpace: 'nowrap',
      fontFamily: spec.font,
      fontSize: '14px',
      color: spec.titleColor,
    });
    el.parentElement.appendChild(title);
    return title;
  };

  // Keep the size legend just below the colorbar, and the shared title to the right of
  // both, vertically centered on the "Organ System" title, wherever Plotly puts things.
  // Positions are relative to el's parent (the .container), which the legends live in.
  const positionLegends = (gd, legend, title) => {
    const colorbar = gd.querySelector('.colorbar');
    if (!colorbar) {
      return;
    }
    const parent = legend.parentElement.getBoundingClientRect();
    const cb = colorbar.getBoundingClientRect();
    legend.style.left = `${cb.left - parent.left}px`;
    legend.style.top = `${cb.bottom - parent.top + spec.legend.gap}px`;

    // Right edge of the size legend's drawn content (its svg box has spare width)
    const lg = legend.getBoundingClientRect();
    const content = legend.querySelector('svg').getBBox();
    const right = Math.max(cb.right, lg.left + content.x + content.width);
    // The only scene annotation is the z title
    const zTitle = gd.querySelector('.annotation')?.getBoundingClientRect();
    const centerY = zTitle ? (zTitle.top + zTitle.bottom) / 2 : (cb.top + lg.bottom) / 2;
    title.style.left = `${right - parent.left + spec.legend.titleGap}px`;
    title.style.top = `${centerY - parent.top - title.offsetHeight / 2}px`;
  };

  const fontsLoaded = document.fonts
    ? Promise.all([document.fonts.load(`12px ${spec.font}`), document.fonts.load(`500 14px ${spec.font}`)])
    : Promise.resolve();

  return Promise.all([fetch(spec.dataUrl).then((res) => res.text()), fontsLoaded.catch(() => {})]).then(([text]) => {
    const allRows = d3.csvParse(text, d3.autoType);
    const xDomain = domainFor(spec.x, allRows);
    const yDomain = domainFor(spec.y, allRows);
    const zDomain = domainFor(spec.z, allRows);
    const rows = allRows.filter(
      (r) =>
        xDomain.includes(r[spec.x.field]) && yDomain.includes(r[spec.y.field]) && zDomain.includes(r[spec.z.field]),
    );
    const values = rows.map((r) => r[spec.value.field]);

    // Vertically center the colorbar + size legend block on the plot
    const plotHeight = el.clientHeight;
    const blockHeight = spec.legend.colorbarLen * plotHeight + spec.legend.gap + sizeLegendHeight;
    const colorbarTop = 1 - (plotHeight - blockHeight) / 2 / plotHeight;

    const trace = {
      type: 'scatter3d',
      mode: 'markers',
      x: rows.map((r) => xDomain.indexOf(r[spec.x.field])),
      y: rows.map((r) => yDomain.indexOf(r[spec.y.field])),
      z: rows.map((r) => zDomain.indexOf(r[spec.z.field])),
      customdata: rows.map((r) => [
        label(spec.z, r[spec.z.field]),
        label(spec.x, r[spec.x.field]),
        label(spec.y, r[spec.y.field]),
        r[spec.value.field],
      ]),
      hovertemplate:
        `${spec.z.title}: %{customdata[0]}<br>` +
        `${spec.x.title}: %{customdata[1]}<br>` +
        `${spec.y.title}: %{customdata[2]}<br>` +
        `${spec.value.title}: %{customdata[3]}<extra></extra>`,
      marker: {
        size: values.map(diameter),
        sizemode: 'diameter',
        color: values,
        colorscale: spec.colorscale,
        reversescale: spec.reverseColors,
        cmin: vmin,
        cmax: vmax,
        opacity: spec.mark.fillOpacity,
        line: { color: spec.mark.stroke, width: spec.mark.strokeWidth },
        colorbar: {
          tickfont: { size: 14, color: spec.labelColor },
          thickness: 14,
          len: spec.legend.colorbarLen,
          yanchor: 'top',
          y: colorbarTop,
        },
      },
    };

    // Tick labels as text pinned to cube edges (see notes at top). In the default view:
    // x labels hang below the front-left bottom edge (y = min, z = min), y labels below
    // the front-right bottom edge (x = max, z = min), and z labels sit beside the right
    // vertical edge (x = max, y = max). The padding spaces keep text off the edge.
    const xEdge = xDomain.length - 0.5;
    const yEdge = yDomain.length - 0.5;
    const textTrace = (props) => ({
      type: 'scatter3d',
      mode: 'text',
      textfont: { family: spec.font, size: 12, color: spec.labelColor },
      hoverinfo: 'skip',
      showlegend: false,
      ...props,
    });
    const xLabelTrace = textTrace({
      x: xDomain.map((_, i) => i),
      y: xDomain.map(() => -0.5),
      z: xDomain.map(() => -0.5),
      text: xDomain.map((v) => `${label(spec.x, v)}  `),
      textposition: 'bottom left',
    });
    const yLabelTrace = textTrace({
      x: yDomain.map(() => xEdge),
      y: yDomain.map((_, i) => i),
      z: yDomain.map(() => -0.5),
      text: yDomain.map((v) => `  ${label(spec.y, v)}`),
      textposition: 'bottom right',
    });
    const zLabelTrace = textTrace({
      x: zDomain.map(() => xEdge),
      y: zDomain.map(() => yEdge),
      z: zDomain.map((_, i) => i),
      text: zDomain.map((v) => `  ${label(spec.z, v)}`),
      textposition: 'middle right',
    });

    // z title: a rotated scene annotation at the middle of the z label edge, shifted
    // right past the longest label (measured in the loaded font)
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.font = `12px ${spec.font}`;
    const zLabelWidth = Math.max(...zLabelTrace.text.map((t) => ctx.measureText(t).width));
    const zTitle = {
      x: xEdge,
      y: yEdge,
      z: (zDomain.length - 1) / 2,
      text: spec.z.title,
      textangle: -90,
      showarrow: false,
      xanchor: 'left',
      xshift: zLabelWidth + 16,
      font: { family: spec.font, size: 14, color: spec.titleColor },
    };

    const layout = {
      font: { family: spec.font, color: spec.labelColor },
      hoverlabel: { font: { family: spec.font } },
      margin: { l: 0, r: 0, t: 0, b: 0 },
      showlegend: false, // otherwise Plotly shows a "trace 0" legend for the extra traces
      scene: {
        xaxis: axis(spec.x, xDomain, 'x'),
        yaxis: axis(spec.y, yDomain, 'y'),
        zaxis: { ...axis(spec.z, zDomain, 'z'), title: { text: '' } }, // title is zTitle
        annotations: [zTitle],
        aspectmode: 'manual',
        aspectratio: spec.aspectratio,
        camera: spec.camera,
      },
    };

    const legend = renderSizeLegend();
    const legendTitle = renderLegendTitle();
    return Plotly.newPlot(el, [trace, xLabelTrace, yLabelTrace, zLabelTrace], layout, {
      responsive: true,
      displaylogo: false,
    }).then((gd) => {
      padAxisTitles(gd);
      positionLegends(gd, legend, legendTitle);
      gd.on('plotly_afterplot', () => positionLegends(gd, legend, legendTitle));
      return gd;
    });
  });
}

const loadQueenV2 = async () => {
  console.log('Loading Queen v2');
  try {
    const entryUrl = new URL(document.currentScript.src);
    const queenUrl =
      entryUrl.origin + entryUrl.pathname.substring(0, entryUrl.pathname.lastIndexOf('/'));
    window.localStorage.setItem('QUEEN_V2_URL', queenUrl);

    const manifest = await fetch(`${queenUrl}/asset-manifest.json`);
    const { entrypoints } = await manifest.json();

    entrypoints.forEach(fileUrl => {
      if (fileUrl.endsWith('.js')) {
        const script = document.createElement('script');
        script.src = `${queenUrl}/${fileUrl}`;
        script.async = true;
        document.body.appendChild(script);
      } else if (fileUrl.endsWith('.css')) {
        const styleSheet = document.createElement('link');
        styleSheet.rel = 'stylesheet';
        styleSheet.href = `${queenUrl}/${fileUrl}`;
        document.head.appendChild(styleSheet);
      }
    });
    console.log('Queen V2 was successfully loaded');
  } catch (error) {
    console.error(error);
    console.error('Failed to load Queen v2 as Web Component');
  }
};
loadQueenV2();

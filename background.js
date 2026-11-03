chrome.runtime.onMessage.addListener((message, sender, reply) => {
  if (message.type !== 'hn-feed') return;
  const offset = Math.max(0, Number(message.offset) || 0);
  const seed = Number(message.seed) || 1;
  fetch(`https://hackertube.org/api/feed?seed=${seed}&offset=${offset}&n=36`, {credentials:'omit', signal:AbortSignal.timeout(20000)})
    .then(r => { if (!r.ok) throw Error(`Feed unavailable (${r.status})`); return r.json(); })
    .then(items => { if (!Array.isArray(items)) throw Error('Unexpected feed response'); reply({items}); })
    .catch(e => reply({error:e.message}));
  return true;
});

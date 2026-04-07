// Global app state
const Store = (() => {
  const STORAGE_KEY = 'ragDocs_v1';

  let state = {
    docs: [],          // { doc_id, filename, chunk_count, uploaded_at }
    activeDocId: null, // currently selected doc in chat
    apiOnline: false,
  };

  // Persist docs across page refresh using sessionStorage
  function load() {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) state.docs = JSON.parse(saved);
    } catch {}
  }

  function save() {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state.docs)); } catch {}
  }

  function addDoc(doc) {
    // avoid duplicates
    state.docs = state.docs.filter(d => d.doc_id !== doc.doc_id);
    state.docs.unshift(doc);
    save();
  }

  function getDocs()       { return state.docs; }
  function getActiveDoc()  { return state.activeDocId; }
  function setActiveDoc(id){ state.activeDocId = id; }
  function setApiOnline(v) { state.apiOnline = v; }
  function isApiOnline()   { return state.apiOnline; }

  load();
  return { addDoc, getDocs, getActiveDoc, setActiveDoc, setApiOnline, isApiOnline };
})();
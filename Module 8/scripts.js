window.onload = () => {
    let dbName = 'myStore';
    let dbVersion = 4; // INT numbers only. No decimal places
    
    let dbRequest = indexedDB.open(dbName, dbVersion);
    console.log('dbRequest', dbRequest);
    
    dbRequest.onupgradeneeded = (ev) => {
      // When db is created or version is changed
      console.log('onupgradeneeded');
      
      let db = ev.target.result;
      // db.createObjectStore(storeName, options); options = {keyPath: string(s), autoIncrement: boolean}
      // Primary keys 
      // db.createObjectStore('users', { keyPath: 'email'}); // Means that email is a primary key and can't have duplicate users with the same email
      // db.createObjectStore('users', { autoIncrement: true}); // Means that the primary key is automatically generated incrementally
      
      
      db.createObjectStore('users', { autoIncrement: true });
    }
    
    dbRequest.onerror = (ev) => {
      console.log('onError');
      console.log(ev.target.errorCode);
    }
    
    dbRequest.onsuccess = (ev) => {
      console.log('onSuccess');
      console.log(ev.target.result);
    }
    
    dbRequest.onblocked = (ev) => {
      // when db is not available or cannot be reached out
      console.log('onblocked');
    }
};


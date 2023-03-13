window.onload = () => {
  let dbName = 'bookStore';
  let dbVersion = 1; // INT numbers only. No decimal places

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


    db.createObjectStore('users', {
      keyPath: 'id'
    });
  }

  dbRequest.onerror = (ev) => {
    console.log('onError');
    console.log(ev.target.errorCode);
  }

  dbRequest.onsuccess = (ev) => {
    console.log('onSuccess');
    console.log(ev.target.result);

    let db = ev.target.result;
    let transaction = db.transaction('users', 'readwrite');
    console.log('trans', transaction);

    let store = transaction.objectStore('users');

    store.add({
      id: 20,
      name: 'Barbara'
    });

    console.log('store', store);

    getItemById(20);
    getAllItems();

    let transactionRO = db.transaction('users', 'readonly');
    let storeRO = transactionRO.objectStore('users');
    let request = storeRO.count();
    console.log('request', request);

    request.onsuccess = (ev) => {
      console.log('onsuccess result', ev.target.result);
    }

    request.onerror = (ev) => {
      console.log('onerror result', ev.target.error);
    }
  }

  dbRequest.onblocked = (ev) => {
    // when db is not available or cannot be reached out
    console.log('onblocked');
  }

  function getItemById(id) {
    // Getting an item by ID
    let getItemByIdRequest = dbRequest.result;
    console.log('getItemByIdRequest', getItemByIdRequest);

    itemTransaction = getItemByIdRequest.transaction('users');
    console.log('itemTransaction', itemTransaction);

    itemStore = itemTransaction.objectStore('users');
    console.log('itemStore', itemStore);

    itemStoreRequest = itemStore.get(id);
    console.log('itemStoreRequest', itemStoreRequest);

    itemStoreRequest.onsuccess = (ev) => {
      console.log('itemStoreRequest.onsuccess: result', ev.target.result);
      let elem = document.createElement('div');
      elem.innerHTML = ev.target.result.id + ' ';
      elem.innerHTML += ev.target.result.name;

      document.body.appendChild(elem);
    }

    itemStoreRequest.onerror = (ev) => {
      console.log('itemStoreRequest.onerror: result', ev.target.error);
    }
  }

  function getAllItems() {
    let getAllItemsRequest = dbRequest.result;
    console.log('getAllItems getAllItemsRequest', getAllItemsRequest);

    let allItemsTransaction = getAllItemsRequest.transaction('users');
    console.log('getAllItems allItemsTransaction', allItemsTransaction);

    let allItemsStore = allItemsTransaction.objectStore('users');
    console.log('getAllItems allItemsStore', allItemsStore);

    let allItemsRequest = allItemsStore.getAll();
    console.log('getAllItems allItemsRequest', allItemsRequest);

    allItemsRequest.onsuccess = (ev) => {
      console.log('allItemsRequest.onsuccess', ev.target.result);

      for(let i = 0; i < ev.target.result.length; i++) {
        let elem = document.createElement('p');
        elem.innerHTML = 'Item ' + i + ': ' + ev.target.result[i].id + ' ' + ev.target.result[i].name;

        document.body.appendChild(elem);
      }
    }

    allItemsRequest.onerror = (ev) => {
      console.log('allItemsRequest.onsuccess', ev.target.error);
      let elem = document.createElement('p');
      elem.innerHTML = JSON.stringify(ev.target.error);

      document.body.appendChild(elem);
    }
  }
};
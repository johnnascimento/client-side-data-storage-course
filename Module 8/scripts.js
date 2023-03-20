window.onload = () => {
  const LIMIT = 2;
  const OFFSET = 2;

  let dbName = 'userRecords';
  let dbVersion = 6; // INT numbers only. No decimal places

  let dbRequest = indexedDB.open(dbName, dbVersion);
  console.log('dbRequest', dbRequest);

  dbRequest.onupgradeneeded = (ev) => {
    // When db is created or version is changed
    let db = ev.target.result;
    let store;

    console.log('onupgradeneeded', db);

    // db.createObjectStore(storeName, options); options = {keyPath: string(s), autoIncrement: boolean}
    // Primary keys 
    // db.createObjectStore('users', { keyPath: 'email'}); // Means that email is a primary key and can't have duplicate users with the same email
    // db.createObjectStore('users', { autoIncrement: true}); // Means that the primary key is automatically generated incrementally

    // This one is executed only once when creating the object store
    // store = db.createObjectStore('users', {
    //   keyPath: 'id'
    // });

    // store.createIndex('by_id', 'id', { unique: false });
    // store.createIndex('by_name', 'name', { unique: false });
    // store.createIndex('by_age', 'age', { unique: false });
    // idxStore.createIndex('by_jobTitle', 'jobTitle', { unique: false });
    let idxStore = dbRequest.transaction.objectStore('users');
    console.log('idxStore', idxStore);

    console.log('removing the idx by_jobTitle');
    idxStore.deleteIndex('by_jobTitle');
  }

  dbRequest.onerror = (ev) => {
    console.log('onError');
    console.log(ev.target.errorCode);
  }

  dbRequest.onsuccess = (ev) => {
    console.log('onSuccess');
    console.log(ev.target.result);

    addUser(10, 'John Lenon', 32, 'Developer');
    addUser(11, 'Barbara Luisa', 34, 'Barista');
    addUser(12, 'Alana Luisa', 1, 'Daughter');
    addUser(13, 'Manuel', 55, 'Carpenter');

    getItemById(20);
    getAllItems();
    countStoreItems();

    updateUser(11, 'John Lenon', 32, 'Frontend Developer');
    updateUser(12, 'Barbara Luisa', 34, 'Coffee Barista');
    updateUser(13, 'Alana Luisa', 1, 'Daughter Of John');
    updateUser(14, 'Manuel', 32, 'Carpenter M');

    let getIdxUser = getIdxInstance('by_id');
    getAllIdx(getIdxUser, 11);

    let getIdxAge = getIdxInstance('by_age');
    getAllIdx(getIdxAge, 32);

    let getIdxName = getIdxInstance('by_name');
    getAllIdx(getIdxName, 'John Lenon');
    getAllIdx(getIdxName, 'Barbara Luisa');
    countAllIdx(getIdxName);
    countAllIdx(getIdxName, 'Bar;bara Luisa');
    getAllIdxKeys(getIdxName)

    console.log('wainting...');
    setTimeout(() => {
      console.log('Deleting Manuel');

      deleteUserById(54);
    }, 2000);

    // Working with cursor
    openCursor(getCurrentStore());
    openKeyCursor(getCurrentStore());
    openCursorByIdx(getIdxAge);
    openKeyCursorByIdx(getIdxAge);

    // Simulating queries like in SQL
    openCursorByLimit(getCurrentStore(), LIMIT, 0, OFFSET);
  }

  dbRequest.onblocked = (ev) => {
    // when db is not available or cannot be reached out
    console.log('onblocked');
  }

  function openCursorByLimit(store, limit, startIdx, offsetIdx) {
    let cursorRequest = store.openCursor();
    let i = startIdx;

    cursorRequest.onsuccess = (ev) => {
      let cursor = ev.target.result;

      if (cursor){
        console.log('limit + offsetIdx', limit + offsetIdx);
        console.log('i', i);

        if (offsetIdx) {
          if (i < limit + offsetIdx) {
            console.log('i < limit + offsetIdx');

            if (i >= limit) {
              console.log('LIMIT - Cursor', cursor.value);
            }

            cursor.continue();
            i++;
          }
        } else {
          if (i < limit) {
            console.log('No offset set');
            console.log('LIMIT - Cursor NO OFFSET', cursor.value);

            cursor.continue();
            i++;
          }
        }
      } else {
        console.log('All item were listed!');
      }
    }
  }

  function openKeyCursor(store) {
    let cursorRequest = store.openKeyCursor();

    cursorRequest.onsuccess = (ev) => {
      let cursor = ev.target.result;

      if (cursor) {
        console.log('KEY cursor.value', cursor);

        cursor.continue();
      } else {
        console.log('KEY cursor doesn\'t exist', cursor);
      }
    }
  }

  function openCursor(store) {
    let cursorRequest = store.openCursor();

    cursorRequest.onsuccess = (ev) => {
      let cursor = ev.target.result;

      if (cursor) {
        console.log('cursor.value', cursor);

        cursor.continue();
      } else {
        console.log('cursor doesn\'t exist', cursor);
      }
    }
  }

  function openKeyCursorByIdx(idx) {
    let cursorRequest = idx.openKeyCursor();

    cursorRequest.onsuccess = (ev) => {
      let cursor = ev.target.result;

      if (cursor) {
        console.log('KEY IDX cursor.value', cursor);

        cursor.continue();
      } else {
        console.log('KEY IDX cursor doesn\'t exist', cursor);
      }
    }
  }

  function openCursorByIdx(idx) {
    let cursorRequest = idx.openCursor();

    cursorRequest.onsuccess = (ev) => {
      let cursor = ev.target.result;

      if (cursor) {
        console.log('IDX cursor.value', cursor);

        cursor.continue();
      } else {
        console.log('IDX cursor doesn\'t exist', cursor);
      }
    }
  }

  function getAllIdx(idxInstance, value) {
    let currentIdxFilter = value != null && value != undefined ? idxInstance.getAll(value) : idxInstance.getAll();

    currentIdxFilter.onsuccess = (ev) => {
      console.log('by_index: ', ev.target.result);

      return ev.target.result;
    }
  }

  function getAllIdxKeys(idxInstance, value) {
    let currentIdxFilter = value != null && value != undefined ? idxInstance.getAllKeys(value) : idxInstance.getAllKeys();

    currentIdxFilter.onsuccess = (ev) => {
      console.log('getAllkeys: ', ev.target.result);

      return ev.target.result;
    }
  }

  function countAllIdx(idxInstance, value) {
    let currentIdxFilter = value != null && value != undefined ? idxInstance.count(value) : idxInstance.count();

    currentIdxFilter.onsuccess = (ev) => {
      console.log('count idx: ', ev.target.result);

      return ev.target.result;
    }
  }

  function getCurrentStore() {
    let idxDb = dbRequest.result;
    let idxTransaction = idxDb.transaction('users', 'readwrite');
    let idxStore = idxTransaction.objectStore('users');

    return idxStore;
  }

  function getIdxInstance(idxName) {
    let idxStore = getCurrentStore();
    let idx = idxStore.index(idxName);

    console.log('getIdxInstance idx', idx);

    return idx;
  }

  function deleteUserById(id) {
    let deleteDbRequest = dbRequest.result;
    let deleteTransaction = deleteDbRequest.transaction('users', 'readwrite');
    let deleteStore = deleteTransaction.objectStore('users');
    let deletedUserRequest = deleteStore.delete(id);

    deletedUserRequest.onsuccess = (ev) => {
      console.log('user deleted', ev);
      console.log('user deleted', ev.target.result);
    }

    deletedUserRequest.onerror = (ev) => {
      console.log('user NOT deleted', ev.target.error);
    }
  }

  function clearAllUsers() {
    let deleteDbRequest = dbRequest.result;
    let deleteTransaction = deleteDbRequest.transaction('users', 'readwrite');
    let deleteStore = deleteTransaction.objectStore('users');
    let deletedUserRequest = deleteStore.clear();

    deletedUserRequest.onsuccess = (ev) => {
      console.log('Users deleted', ev);
      console.log('user deleted', ev.target.result);
    }

    deletedUserRequest.onerror = (ev) => {
      console.log('user NOT deleted', ev.target.error);
    }
  }

  function countStoreItems() {
    let countStoreRequest = dbRequest.result;
    let transactionRO = countStoreRequest.transaction('users', 'readonly');
    let storeRO = transactionRO.objectStore('users');
    let storeCount = storeRO.count();

    console.log('storeCount', storeCount);

    storeCount.onsuccess = (ev) => {
      console.log('onsuccess result', ev.target.result);
      let divElem = document.createElement('div');
      let h4Elem = document.createElement('h4');
      let pElem = document.createElement('p');

      h4Elem.innerHTML = 'Number of Object in our store is:'
      pElem.innerHTML = ev.target.result;

      divElem.appendChild(h4Elem);
      divElem.appendChild(pElem);

      document.body.appendChild(divElem);
    }

    storeCount.onerror = (ev) => {
      console.log('onerror result', ev.target.error);
    }
  }

  function addUser(userId, userName, age, jobTitle) {
    let user = {
      id: userId,
      name: userName,
      age: age,
      jobTitle: jobTitle
    };
    let addUserRequest = dbRequest.result;
    let transaction = addUserRequest.transaction('users', 'readwrite');
    let store = transaction.objectStore('users');

    console.log('addUser user', user);
    console.log('addUser trans', transaction);
    console.log('addUser store', store);

    store.add(user);

    console.log('store', store);
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
        let userId = ev.target.result[i].id;
        let userName = ev.target.result[i].name;
        let elem = document.createElement('p');
        let userClass = 'user-' + userId;
        elem.classList.add(userClass);
        elem.setAttribute('userName', userName);
        elem.innerHTML = 'Item ' + i + ': ' + userId + ' ' + userName;

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

  function updateUser(id, name, age, jobTitle) {
    let user = {
      id: id,
      name: name,
      age: age,
      jobTitle: jobTitle
    };

    let db = dbRequest.result;
    let userTransaction = db.transaction('users', 'readwrite');
    let userStore = userTransaction.objectStore('users');
    let userRequest = userStore.put(user);

    console.log('userRequest', userRequest);

    userRequest.onsuccess = (ev) => {
      console.log('User updated!', ev.target.result);

      getItemById(ev.target.result);
    }

    userRequest.onerror = (ev) => {
      console.log('User NOT updated!', ev.target.error);
    }
  }
};
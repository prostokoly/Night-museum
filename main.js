function main() {
  const canvas = document.querySelector('.screen');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;

  scene.background = new THREE.Color(0x000000);

  camera.position.set(0, 2, 7);

  const ambientLight = new THREE.AmbientLight(0x404040, 0.1);
  scene.add(ambientLight);

  const spotlight = new THREE.SpotLight(0xffffff, 3, 10, Math.PI / 6, 0.3);
  spotlight.position.set(0, 3, 3);
  spotlight.target.position.set(0, 2, 0);
  spotlight.castShadow = true;
  spotlight.distance = 30;


  spotlight.shadow.mapSize.width = 1024;
  spotlight.shadow.mapSize.height = 1024;
  spotlight.shadow.bias = -0.005;

  scene.add(spotlight);
  scene.add(spotlight.target);

  window.addEventListener('mousemove', (event) => {
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;


    const cameraPosition = camera.position.clone();


    const lightDirection = new THREE.Vector3(x, y, -1).unproject(camera).sub(cameraPosition).normalize();

    spotlight.position.copy(cameraPosition);

    spotlight.target.position.copy(cameraPosition.clone().add(lightDirection.multiplyScalar(10)));
    spotlight.target.updateMatrixWorld();
  });

  spotlight.angle = Math.PI / 14;
  spotlight.penumbra = 0.3;
  spotlight.intensity = 2;

  const textureLoader = new THREE.TextureLoader();
  const floorTexture = textureLoader.load('https://avatars.mds.yandex.net/i?id=5a741f2c86c397f8a3e82703326bd51927c2e270-9111606-images-thumbs&n=13');
  floorTexture.wrapS = THREE.RepeatWrapping;
  floorTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.repeat.set(4, 4);

  const wallTexture = textureLoader.load('https://sun9-2.userapi.com/impf/c837128/v837128715/33ffd/XqnN5bydFYk.jpg?size=604x292&quality=96&sign=6f059d94771af638dc2ae708babee0ba&type=album');
  wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
  wallTexture.repeat.set(2, 2);


  const ceilingTexture = textureLoader.load('https://avatars.mds.yandex.net/i?id=4acf579b61f7067822f6c93089652b03_l-4789759-images-thumbs&n=13');
  wallTexture.wrapS = ceilingTexture.wrapT = THREE.RepeatWrapping;
  wallTexture.repeat.set(1, 1);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshPhongMaterial({ map: floorTexture, side: THREE.DoubleSide }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  floor.castShadow = true
  scene.add(floor);

  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshPhongMaterial({ map: ceilingTexture, side: THREE.DoubleSide }));
  ceiling.position.y = 5;
  ceiling.rotation.x = Math.PI / 2;
  scene.add(ceiling);


  const walls = [
    { position: { x: 0, y: 2.5, z: -5 }, rotationY: 0 },
    { position: { x: -5, y: 2.5, z: 0 }, rotationY: Math.PI / 2 },
    { position: { x: 5, y: 2.5, z: 0 }, rotationY: -Math.PI / 2 }
  ];

  walls.forEach((wallData) => {
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(10, 5), new THREE.MeshPhongMaterial({ map: wallTexture, side: THREE.DoubleSide }));
    wall.position.set(wallData.position.x, wallData.position.y, wallData.position.z);
    wall.rotation.y = wallData.rotationY;
    wall.receiveShadow = true;
    wall.castShadow = true
    scene.add(wall);
  });


  const pictures = [];
  const pictureTextures = [
    'https://avatars.mds.yandex.net/i?id=3afbc0c1c41ee98a4a405bc7cec5790bc6ee5b70-12922404-images-thumbs&n=13', 'https://avatars.mds.yandex.net/i?id=497fcaed566e34551c925fe4dabce5b6_l-5845211-images-thumbs&n=13', 'https://avatars.mds.yandex.net/i?id=8b7ba7f0f1f4f06a6e50aabfe48cd35d_l-5234557-images-thumbs&n=13',
    'https://avatars.mds.yandex.net/i?id=12a38f09c6c4d9af460a542e0576bf0fa8ce8107-10285533-images-thumbs&n=13', 'https://avatars.mds.yandex.net/i?id=53a1633dce3b3ddbd059a8ac6da6ec4ddf67cd62da86c373-12577662-images-thumbs&n=13', 'https://avatars.mds.yandex.net/i?id=89d08346443934205f73523791eb4765_l-4961046-images-thumbs&n=13',
    'https://avatars.mds.yandex.net/get-weather/10145165/KAzFieTkdBbMUSjxpVXS/orig', 'https://avatars.mds.yandex.net/get-entity_search/937587/350873210/S600xU_2x', 'https://avatars.mds.yandex.net/get-entity_search/9705028/687418728/S600xU_2x',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Ivan_Shishkin_-_%D0%A0%D0%BE%D0%B6%D1%8C_-_Google_Art_Project.jpg/959px-Ivan_Shishkin_-_%D0%A0%D0%BE%D0%B6%D1%8C_-_Google_Art_Project.jpg'
  ];



  const picturePositions = [
    { x: -3, y: 3, z: -4.9, rotationY: 0 },
    { x: 0, y: 3, z: -4.9, rotationY: 0 },
    { x: 3, y: 3, z: -4.9, rotationY: 0 },

    { x: -4.9, y: 3, z: -3, rotationY: Math.PI / 2 },
    { x: -4.9, y: 3, z: 0, rotationY: Math.PI / 2 },
    { x: -4.9, y: 3, z: 3, rotationY: Math.PI / 2 },

    { x: 4.9, y: 3, z: -3, rotationY: -Math.PI / 2 },
    { x: 4.9, y: 3, z: 0, rotationY: -Math.PI / 2 },
    { x: 4.9, y: 3, z: 3, rotationY: -Math.PI / 2 },

    { x: 0, y: 1.5, z: -4.9, rotationY: 0 }
  ];

  pictureTextures.forEach((url, index) => {
    const texture = new THREE.TextureLoader().load(url);
    const pictureMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
    const picture = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1), pictureMaterial);

    const pos = picturePositions[index];
    picture.position.set(pos.x, pos.y, pos.z);
    picture.rotation.y = pos.rotationY;
    scene.add(picture);

    pictures.push(picture);
  });

  let enlargedPicture = null;
  window.addEventListener('click', (event) => {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(pictures);

    if (intersects.length > 0) {
      const selectedPicture = intersects[0].object;

      if (enlargedPicture === selectedPicture) {

        selectedPicture.scale.set(1, 1, 1);
        selectedPicture.position.copy(selectedPicture.userData.originalPosition);
        selectedPicture.rotation.y = selectedPicture.userData.originalRotation;
        enlargedPicture = null;
      } else {
        if (enlargedPicture) {
          enlargedPicture.scale.set(1, 1, 1);
          enlargedPicture.position.copy(enlargedPicture.userData.originalPosition);
          enlargedPicture.rotation.y = enlargedPicture.userData.originalRotation;
        }

        selectedPicture.userData.originalPosition = selectedPicture.position.clone();
        selectedPicture.userData.originalRotation = selectedPicture.rotation.y;


        selectedPicture.scale.set(2.5, 2.5, 1);
        selectedPicture.position.set(0, 2.5, camera.position.z - 3);
        selectedPicture.rotation.y = 0;
        enlargedPicture = selectedPicture;
      }
    }
  });

  function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
  }

  animate();
}
main()
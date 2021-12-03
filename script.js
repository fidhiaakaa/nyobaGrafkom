let scene, camera, renderer, sphereCamera;

      function init() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(55, window.innerWidth/window.innerHeight,45,30000);
        camera.position.set(50,50,80);

        renderer = new THREE.WebGLRenderer({antialias:true});
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        //renderer.render(scene, camera, controls);
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        document.body.appendChild(renderer.domElement);

        //control
        let controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.addEventListener('change', renderer);
        controls.target.set(0, 20, 0);
        controls.maxDistance = 150;
        //controls.enableZoom = false;

        //ground
        let loaderPlane = new THREE.TextureLoader();
        let plane = new THREE.Mesh(
          new THREE.PlaneGeometry(100, 100, 50, 50),
          new THREE.MeshPhongMaterial({
            color: 0xffffff,
            map: loaderPlane.load('./assets/rumput.jfif')
            })
        );
        plane.rotation.x = -Math.PI*0.5;
        plane.position.set(0, 0, 0);
        plane.receiveShadow = true;
        scene.add(plane);

        //object gltf
        let loader3 = new THREE.GLTFLoader();
        loader3.load('./pohon/scene.gltf', function(gltf) {
          gltf.scene.traverse(c => {
            c.castShadow = true;
            c.receiveShadow = true;
            c.position.set(0,20,0);
            c.scale.set(30,10,10);
          });
          scene.add(gltf.scene);
        });

        //object
        let cube = new THREE.Mesh(
          new THREE.CubeGeometry(10, 10, 10, 10),
          new THREE.MeshPhongMaterial({
            color: 0x000000
          })
        );
        cube.position.set(90,5,0);
        cube.castShadow = true;
        scene.add(cube);

        //light
        let light = new THREE.DirectionalLight(0xffffff, 1.0);
        light.position.set(-90, 70, 100);
        light.castShadow = true;
        //light.shadow.camera.near = 0.1;
        //light.shadow.camera.far = 25;
        scene.add(light);

        let alight = new THREE.AmbientLight(0xffffff, 0.3);
        alight.castShadow = true;
        scene.add(alight);

        //Fog
        const color = 0xffffff;
        const near = 90;
        const far = 160;
        scene.fog = new THREE.Fog(color, near, far);

        //skybox
        let urls = [
          './assets/trance_ft.jpg', './assets/trance_bk.jpg',
          './assets/trance_up.jpg', './assets/trance_dn.jpg',
          './assets/trance_rt.jpg', './assets/trance_lf.jpg'
        ];
        let loader = new THREE.CubeTextureLoader();
        scene.background = loader.load(urls);

        //realistic reflection
        sphereCamera = new THREE.CubeCamera(1,1000,500);
        sphereCamera.position.set(0,300,0);
        scene.add(sphereCamera);

        let sphereMaterial = new THREE.MeshBasicMaterial({
          envMap: sphereCamera.renderTarget
        });
        let sphereGeo = new THREE.SphereGeometry(10,50,50);
        let sphere = new THREE.Mesh(sphereGeo,sphereMaterial);
        sphere.position.set(0,50,0);
        scene.add(sphere);

        render();
      }

      function render() {
        renderer.render(scene,camera);
        sphereCamera.updateCubeMap(renderer,scene);
        requestAnimationFrame(render);
      }

      init();

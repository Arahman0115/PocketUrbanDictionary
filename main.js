import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TTFLoader } from 'three/examples/jsm/loaders/TTFLoader';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
//import { createParticleBackground } from './particles.js';

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 100); // Adjust camera position


const listener = new THREE.AudioListener();
camera.add( listener );

// create a global audio source
const sound = new THREE.Audio( listener );

// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.load( './Interstellar.ogg', function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop( true );
	sound.setVolume( 0.5 );
	sound.play();
});

// Create a CSS2DRenderer
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
document.body.appendChild(labelRenderer.domElement);

// Create a WebGLRenderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Create a red sphere
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('./space.jpg');

const geometry = new THREE.SphereGeometry(45, 70, 70);
const material = new THREE.MeshBasicMaterial({ map: texture });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);
sphere.position.set(0,-15,0)

const ringRadius = 70;
const ringTubeRadius = 1.5;
const ringSegments = 500;
const ringGeometry = new THREE.TorusGeometry(ringRadius, ringTubeRadius, ringSegments, ringSegments);
const ringMaterial = new THREE.MeshBasicMaterial({ map: texture });
const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
ringMesh.position.set(0,-1,0);
ringMesh.rotation.x = 30;
ringMesh.rotation.y = .5;
scene.add(ringMesh);


const planegeom = new THREE.PlaneGeometry(3, 1);
const planematerial = new THREE.MeshBasicMaterial({ map: texture });
const planemesh = new THREE.Mesh(planegeom, planematerial);
planemesh.position.set(0,2,0);


//createParticleBackground(scene);
const particleGeometry = new THREE.BufferGeometry();
const particleCount = 10000; // Number of stars

const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    colors[i * 3] = Math.random() * 0.5 + 0.5; // R
    colors[i * 3 + 1] = Math.random() * 0.5 + 0.5; // G
    colors[i * 3 + 2] = Math.random() * 0.5 + 0.5; // B
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const particleMaterial = new THREE.PointsMaterial({
    size: 1, // Size of the stars
    vertexColors: THREE.VertexColors // Enable per-vertex coloring
});

const particles = new THREE.Points(particleGeometry, particleMaterial);

scene.add(particles);

// Create orbit controls
const controls = new OrbitControls(camera, document.querySelector('#bg'));
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;

// Create a label
const label = document.createElement('div');
label.className = 'label';
label.textContent = 'Word';

const deflabel = document.createElement('div');
deflabel.className = 'definition';
deflabel.textContent = 'Definition';

const exlabel = document.createElement('div');
exlabel.className = 'example';
exlabel.textContent = 'Example';


const cssObject = new CSS2DObject(label);
cssObject.position.set(0, -20, 1); // Adjust label position
scene.add(cssObject);

const cssObject2 = new CSS2DObject(deflabel);
cssObject2.position.set(0, -40, 0 ); // Adjust label position
scene.add(cssObject2);

const cssObject3 = new CSS2DObject(exlabel);
cssObject3.position.set(0, -60, 0 ); // Adjust label position
scene.add(cssObject3);



// Create function to fetch random word
async function getRandomWord() {
	try {
	  const response = await fetch('https://api.urbandictionary.com/v0/random');
	  const data = await response.json();
  
	  if (data.list && data.list.length > 0) {
		const randomEntry = data.list[0];
		const word = randomEntry.word;
		let definition = randomEntry.definition;
		const pattern = /\[([^\]]+)\]/g;
		console.log(definition);

		// Replace all occurrences of square brackets and their content with an empty string
		definition = definition.replace(pattern, "$1");


		let example = randomEntry.example;
		example = example.replace(pattern, "$1");
		console.log(word);
		console.log(data);
		return { 
			word: '\n' + word + '\n', 
			definition:  '\n' + definition + '\n', 
			example: example + '\n' };
	  } else {
		throw new Error('No random word found.');
	  }
	} catch (error) {
	  console.error('Error fetching data:', error.message);
	  return null;
	}
  }
// Create a Button

const buttonContainer = document.createElement('div');
buttonContainer.className = 'button-container';
const button = document.createElement('button');
button.textContent = 'NEW FUCKING WORD';
buttonContainer.appendChild(button);
const buttonObject = new CSS2DObject(buttonContainer);
buttonObject.position.set(0, 30, 0); // Adjust button position
scene.add(buttonObject);


const addbuttonContainer = document.createElement('div');
const addbutton = document.createElement('button');
addbutton.textContent = 'ADD FUCKING WORD TO DICTIONARY YOU FUCK';
addbutton.className='rounded-button';
const addbuttonObject = new CSS2DObject(addbuttonContainer);
addbuttonObject.position.set(0,15,0)
addbuttonContainer.appendChild(addbutton);
scene.add(addbuttonObject)

const seedictbuttonContainer = document.createElement('div');
const seedictbutton = document.createElement('button');
seedictbutton.textContent = 'SEE DICTIONARY';
seedictbutton.className='rounded-button';
const seedictbuttonObject = new CSS2DObject(seedictbuttonContainer);
seedictbuttonObject.position.set(0, -2,0)
seedictbuttonContainer.appendChild(seedictbutton);
scene.add(seedictbuttonObject);

const savebuttonContainer = document.createElement('div');
const savebutton = document.createElement('button');
savebutton.textContent = 'Save';
savebutton.className='rounded-button';
const savebuttonObject = new CSS2DObject(savebuttonContainer);
savebuttonObject.position.set(0,-3,0)
savebuttonContainer.style.position = 'bottom';





button.className = 'rounded-button'; // Add a class for styling
button.addEventListener('click', async () => {
    const wordData = await getRandomWord();
    if (wordData) {
		setIsTruetoTrue();
        const { word, definition, example } = wordData;
        label.textContent = `Word: ${word}`;
		deflabel.textContent = `Definition: ${definition}`; 
		exlabel.textContent = `Example: ${example}`;
	} else {
        label.textContent = 'Failed to fetch word';
    }
		
});


let dictionaryEntries = JSON.parse(localStorage.getItem('dictionaryEntries')) || [];


//savebutton.addEventListener('click', () => {
//	saveDictionaryEntries() 
//});

addbutton.addEventListener('click', () => {
    // Create a new dictionary entry object
    const newEntry = {
        Word: label.textContent.split(':')[1].trim(),
        Definition: deflabel.textContent.split(':')[1].trim(),
        Example: exlabel.textContent.split(':')[1].trim()
    };

    // Add the new entry to the array
    dictionaryEntries.push(newEntry);

    // Save the dictionary entries to localStorage
    saveDictionaryEntries();
});

function saveDictionaryEntries() {
    localStorage.setItem('dictionaryEntries', JSON.stringify(dictionaryEntries));
}







// Event listener for "See Dictionary" button click
seedictbutton.addEventListener('click', () => {
    // Hide the original scene
    scene.visible = true;
	scene.remove(addbuttonObject);
	scene.remove(buttonObject);
	scene.remove(seedictbuttonObject);
	scene.remove(cssObject)
	scene.remove(cssObject2)
	scene.remove(cssObject3)
	scene.add(savebuttonObject);
    scene.remove(newwordtextMesh)

	buttonObject.element.style.display = 'none';
    addbuttonObject.element.style.display = 'none';
    seedictbuttonObject.element.style.display = 'none'

    // Create a new scene for displaying the dictionary

	
    // Function to create HTML elements for dictionary entries
	function createDictionaryElements() {
		Newbool = false;
		let index = 0;
		const newcontainer = document.createElement('div');
		newcontainer.style.top = '50px';
		newcontainer.style.left = '50px';
		newcontainer.style.overflowY = 'auto';
		newcontainer.style.maxHeight='80vh';
		newcontainer.style.color='red';
		newcontainer.style.overflowY = 'scroll';
		document.body.appendChild(newcontainer);
		const entryHeight = 80;

		for (let i = 0; i < dictionaryEntries.length; i++) {
			const entry = dictionaryEntries[i];
			const entryDiv = document.createElement('div');
            entryDiv.innerHTML = `Word: ${entry.Word}<br>Definition: ${entry.Definition}<br>Example: ${entry.Example}`;
			entryDiv.style.marginBottom = '10px';
			entryDiv.style.color = 'white';
			entryDiv.className = 'entryDivStyle';
			entryDiv.style.fontWeight = 'bold';
			entryDiv.style.fontSize = '16px';
			entryDiv.style.padding = '1px';
			entryDiv.style.borderRadius = '5px';
			entryDiv.style.position = 'absolute';
			entryDiv.style.top = `${index * entryHeight}px`;
			newcontainer.appendChild(entryDiv);
			index++;
		}
	
		// "Take me back" button
		const backButton = document.createElement('button');
		backButton.textContent = 'Take me back';
		backButton.style.position = 'center';
		backButton.style.bottom = '20px';
		backButton.className = 'rounded-button';
		backButton.style.left = '20px';
		backButton.addEventListener('click', () => {
			// Show the original scene and remove the dictionary scene elements
			scene.visible = true;
			
			scene.add(addbuttonObject);
			scene.add(addbuttonObject);
			scene.add(buttonObject);
			scene.add(seedictbuttonObject);
			scene.add(cssObject)
			scene.add(cssObject2)
			scene.add(cssObject3)
            

            newcontainer.remove();
            buttonObject.element.style.display = 'block';
            addbuttonObject.element.style.display = 'block';
            seedictbuttonObject.element.style.display = 'block';
        });
        newcontainer.appendChild(backButton);
    }
    

    // Call the function to create dictionary elements
    createDictionaryElements();
});



const fontLoader = new FontLoader();
fontLoader.load(
    'node_modules/three/examples/fonts/droid/droid_serif_regular.typeface.json',
    (droidFont) => {
        const textGeometry = new TextGeometry('PocketUrbanDict', {
            height: 0.5,
            size: 10,
            font: droidFont,
        });
        textGeometry.computeBoundingBox();
        const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;

        // Calculate the position to center the text along the X-axis
        const screenWidth = window.innerWidth;
        const centerX = -textWidth / 2; // Adjust this value if needed

        const textMaterial = new THREE.MeshNormalMaterial();
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);

        // Set the position of the text mesh
        textMesh.position.x = centerX;
        textMesh.position.y = 50; // Adjust Y position as needed
        textMesh.position.z = 0; // Adjust Z position as needed
        console.log(textMesh.position.x);
        scene.add(textMesh);

        textMesh.material.opacity = 0;

        fadeInFont(textMesh, 2000); // Fade in duration set to 2000 milliseconds (2 seconds)
    }
);

function fadeInFont(mesh, duration) {
    let start = null;
    const initialOpacity = mesh.material.opacity;
    const targetOpacity = 1; // Opacity to fade to
    
    function animatet(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const opacityProgress = (progress / duration);
        
        // Apply ease-in-out effect to the opacity progress
        const easedOpacityProgress = Math.cos(opacityProgress * Math.PI) * -0.5 + 0.5;
        
        mesh.material.opacity = initialOpacity + (targetOpacity - initialOpacity) * easedOpacityProgress;
        
        if (progress < duration) {
            requestAnimationFrame(animatet);
        }
    }
    
    requestAnimationFrame(animatet);
}
let newwordtextMesh;

fontLoader.load(
    'node_modules/three/examples/fonts/droid/droid_serif_regular.typeface.json',
    (droidFont) => {
        // Create text geometry
        const newwordGeometry = new TextGeometry('ENHANCING EDUCATION', {
            height: 0.5,
            size: 7,
            font: droidFont,
        });
        newwordGeometry.computeBoundingBox();
        const textWidth = newwordGeometry.boundingBox.max.x - newwordGeometry.boundingBox.min.x;

        // Calculate the position to center the text along the X-axis
        const screenWidth = window.innerWidth;
        const centerX = -textWidth / 2; // Adjust this value if needed

        // Create text material and mesh
        const newwordtextMaterial = new THREE.MeshNormalMaterial();
        newwordtextMesh = new THREE.Mesh(newwordGeometry, newwordtextMaterial);

        // Set the position of the text mesh
        newwordtextMesh.position.x = centerX;
        newwordtextMesh.position.y = 40; // Adjust Y position as needed
        newwordtextMesh.position.z = 0; // Adjust Z position as needed
		scene.add(newwordtextMesh);

        // Add event listener to the text mesh
		newwordtextMesh.addEventListener('click', async () => {
			const wordData = await getRandomWord();
			if (wordData) {
				const { word, definition, example } = wordData;
				label.textContent = `Word: ${word}`;
				deflabel.textContent = `Definition: ${definition}`; 
				exlabel.textContent = `Example: ${example}`;
			} else {
				label.textContent = 'Failed to fetch word';
			}
				
		});
		
      

    }
);


let isTrue = true;

function setIsTruetoTrue() {
	isTrue = false;
	setTimeout(() => {
        isTrue = true; // Set isTrue to false after 5 seconds
    }, 838); // 5000 milliseconds = 5 seconds
}
let Newbool = true;

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    //sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;
	ringMesh.rotation.y += .005;


   // if (!isTrue) {
    //    newwordtextMesh.rotation.y += .3;
    //}

    planemesh.rotation.y += 0.30;
    const positions = particles.geometry.attributes.position.array;

    for (let i = 0; i < positions.length; i += 3) {
        if (!Newbool) {
            positions[i + 1] -= Math.random() * 0.4; // Update y-position in a downward direction

            // Reset particle position if it falls below a certain threshold
            if (positions[i + 1] < -1000) {
                positions[i] = (Math.random() - 0.5) * 2000;
                positions[i + 1] = 1000; // Reset y-position above the viewport
                positions[i + 2] = (Math.random() - 0.5) * 2000;
            }
        } else {
            positions[i + 1] -= Math.random() * 0.1; // Update y-position in a downward direction

            // Reset particle position if it falls below a certain threshold
            if (positions[i + 1] < -1000) {
                positions[i] = (Math.random() - 0.5) * 2000;
                positions[i + 1] = 1000; // Reset y-position above the viewport
                positions[i + 2] = (Math.random() - 0.5) * 2000;
            }
        }
    }

  // Mark the buffer geometry as needing an update
  particles.geometry.attributes.position.needsUpdate = true;
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera); // Render labels separately with CSS2DRenderer
}

animate();

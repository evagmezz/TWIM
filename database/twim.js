db.createUser({
  user: 'admin',
  pwd: 'admin',
  roles: [
    {
      role: 'readWrite',
      db: 'mongoTwim',
    },
  ],
});

db = db.getSiblingDB('mongoTwim');

db.comments.insertMany([
  {
    _id: '766c443e-ef80-418d-b249-2f3439992780',
    __v: 0,
    content: 'que guapos!!!!',
    createdAt: new Date('2024-04-25T09:16:10.196Z'),
    postId: 'd08939f3-edcd-40c9-8349-9c290409c8b1',
    updatedAt: new Date('2024-04-25T09:16:10.196Z'),
    userId: 'eab57d50-b523-479b-a20e-fa9a14ae201f',
  },
  {
    _id: '6c8be092-5127-443c-84a4-ee9e94090840',
    __v: 0,
    content: 'te voy a echar mucho de menos :(',
    createdAt: new Date('2024-04-25T09:16:22.155Z'),
    postId: '90512b25-ffd7-4f91-9333-72ab843514b2',
    updatedAt: new Date('2024-04-25T09:16:22.155Z'),
    userId: 'eab57d50-b523-479b-a20e-fa9a14ae201f',
  },
  {
    _id: 'e5191b07-9fe9-403d-bc8d-efa93a51d5d8',
    __v: 0,
    content: 'TE ECHO DE MENOS',
    createdAt: new Date('2024-04-25T09:16:39.616Z'),
    postId: 'f07a44ae-e710-4dbd-abc9-164093adc263',
    updatedAt: new Date('2024-04-25T09:16:39.616Z'),
    userId: 'eab57d50-b523-479b-a20e-fa9a14ae201f',
  },
  {
    _id: '6df33675-0e45-4f85-9a66-c05bbe4b304b',
    __v: 0,
    content: 'que bonito!!!',
    createdAt: new Date('2024-04-25T10:23:15.432Z'),
    postId: '2852e84f-32d6-4204-b632-aa37972ddc56',
    updatedAt: new Date('2024-04-25T10:23:15.432Z'),
    userId: 'ad50696b-84e7-48ef-acff-c55e51555444',
  },
  {
    _id: '2d39cae3-b711-4a25-b3ca-2dc85749097d',
    __v: 0,
    content: 'QUE GUAPAAS',
    createdAt: new Date('2024-04-25T10:23:27.601Z'),
    postId: '09840bc1-ca0f-4d2f-9a7e-89329c3aea14',
    updatedAt: new Date('2024-04-25T10:23:27.601Z'),
    userId: 'ad50696b-84e7-48ef-acff-c55e51555444',
  },
  {
    _id: 'c92cd2f5-7fb7-498b-9d40-a225046a8e8a',
    __v: 0,
    content: 'somos las mejores!',
    createdAt: new Date('2024-04-25T10:23:35.178Z'),
    postId: 'df4ca0ea-73f3-4c70-b695-bebe42833e2f',
    updatedAt: new Date('2024-04-25T10:23:35.178Z'),
    userId: 'ad50696b-84e7-48ef-acff-c55e51555444',
  },
  {
    _id: '0c9092b3-9adb-4ee2-b8e9-05d369990601',
    __v: 0,
    content: 'guapisimas;)',
    createdAt: new Date('2024-04-25T10:23:50.513Z'),
    postId: 'cc51ecb2-9be7-4316-986b-b30df89cda09',
    updatedAt: new Date('2024-04-25T10:23:50.513Z'),
    userId: 'ad50696b-84e7-48ef-acff-c55e51555444',
  },
  {
    _id: '5349b536-bf87-48df-a507-c8f79a98c010',
    __v: 0,
    content: 'que lindaaas',
    createdAt: new Date('2024-04-25T11:13:19.241Z'),
    postId: '18ec1e26-32ae-4b8f-9457-5d8a0700659a',
    updatedAt: new Date('2024-04-25T11:13:19.241Z'),
    userId: 'eab57d50-b523-479b-a20e-fa9a14ae201f',
  },
  {
    _id: 'f09dd7f8-ce48-4233-8e05-46bd836d906c',
    __v: 0,
    content: 'vamos juntas!!!',
    createdAt: new Date('2024-04-25T12:12:10.562Z'),
    postId: 'e1633d35-d357-4c4c-ac8b-768f9353e92c',
    updatedAt: new Date('2024-04-25T12:12:10.562Z'),
    userId: 'ad50696b-84e7-48ef-acff-c55e51555444',
  },
  {
    _id: '2684cba0-9d84-4517-bdf8-6b5dde9ff63a',
    __v: 0,
    content: 'xoxoooo que reinaaaa',
    createdAt: new Date('2024-04-26T12:28:11.610Z'),
    postId: '86a11f3f-45a4-4e14-8d57-fd1e8d1599c3',
    updatedAt: new Date('2024-04-26T12:28:11.610Z'),
    userId: '7ec16af6-c69e-4883-8698-836c9bc2cda9',
  },
  {
    _id: '53a65d3c-6e53-4acf-81b7-716daeaac528',
    __v: 0,
    content: 'lulu la mejor',
    createdAt: new Date('2024-04-26T12:50:15.881Z'),
    postId: 'df4ca0ea-73f3-4c70-b695-bebe42833e2f',
    updatedAt: new Date('2024-04-26T12:50:15.881Z'),
    userId: 'f280aaea-04b2-42cd-b0c1-bcba503d88c9',
  },
  {
    _id: '4b2fe48d-ff27-46aa-ae6d-805b422cf0f7',
    __v: 0,
    content: 'que guapas!!',
    createdAt: new Date('2024-04-26T12:50:39.473Z'),
    postId: '1095bade-6db2-4036-b32e-dd56d8e9830b',
    updatedAt: new Date('2024-04-26T12:50:39.473Z'),
    userId: 'f280aaea-04b2-42cd-b0c1-bcba503d88c9',
  },
  {
    _id: '53745cfd-8c1c-46bd-940d-b3988784b5a9',
    __v: 0,
    content: 'Vaya par de guapas!!!!!',
    createdAt: new Date('2024-04-28T09:57:59.239Z'),
    postId: '05ccc5ab-224b-469d-b317-6a0079407e4f',
    updatedAt: new Date('2024-04-28T09:57:59.239Z'),
    userId: 'f280aaea-04b2-42cd-b0c1-bcba503d88c9',
  },
  {
    _id: '42c6428c-3773-414f-b5c9-6955982b80ff',
    __v: 0,
    content: 'toma que toma!!!',
    createdAt: new Date('2024-04-28T09:59:00.164Z'),
    postId: '51e46287-78e4-4eb2-93c1-958999044bec',
    updatedAt: new Date('2024-04-28T09:59:00.164Z'),
    userId: 'ad50696b-84e7-48ef-acff-c55e51555444',
  },
  {
    _id: '6eb21139-e633-47f4-8f16-e32782efc151',
    __v: 0,
    content: 'que guapoooos!🩷',
    createdAt: new Date('2024-04-28T09:59:34.866Z'),
    postId: '96ce85d8-df42-4cca-a4b1-54db0c4b888d',
    updatedAt: new Date('2024-04-28T09:59:34.866Z'),
    userId: 'ad50696b-84e7-48ef-acff-c55e51555444',
  },
  {
    _id: 'e716ae1a-38e1-4f2f-8808-12c8ea998723',
    __v: 0,
    content: 'que envidiaaaa😭',
    createdAt: new Date('2024-04-28T10:00:35.704Z'),
    postId: 'ac69cb0d-c661-480d-9f84-88047f572820',
    updatedAt: new Date('2024-04-28T10:00:35.704Z'),
    userId: 'eab57d50-b523-479b-a20e-fa9a14ae201f',
  },
  {
    _id: '2da8e9bb-95d1-40a3-a5f9-b5822ef9ed6a',
    __v: 0,
    content: 'que pikete',
    createdAt: new Date('2024-04-28T10:00:45.028Z'),
    postId: 'b351f4ba-f545-4f00-896d-fe3f0a2b1018',
    updatedAt: new Date('2024-04-28T10:00:45.028Z'),
    userId: 'eab57d50-b523-479b-a20e-fa9a14ae201f',
  },
  {
    _id: '2f8b0ac3-a246-4b1f-b0d1-741e4f72268d',
    __v: 0,
    content: 'que chuleriaaaaa!!',
    createdAt: new Date('2024-04-28T10:01:23.557Z'),
    postId: '96ce85d8-df42-4cca-a4b1-54db0c4b888d',
    updatedAt: new Date('2024-04-28T10:01:23.557Z'),
    userId: 'eab57d50-b523-479b-a20e-fa9a14ae201f',
  },
  {
    _id: 'ba8adcf0-3810-4850-9e57-e4a75cba6426',
    __v: 0,
    content: 'una preguntita',
    createdAt: new Date('2024-04-28T10:01:37.566Z'),
    postId: '33f6ea1b-eb5b-43b2-9e8c-0c5fb8026b1f',
    updatedAt: new Date('2024-04-28T10:01:37.566Z'),
    userId: 'eab57d50-b523-479b-a20e-fa9a14ae201f',
  },
  {
    _id: 'e71aadec-7b01-4ca0-9084-0669233b7207',
    __v: 0,
    content: 'guapaa',
    createdAt: new Date('2024-05-22T17:00:24.321Z'),
    postId: 'a25e7b1f-0c38-4487-85c4-da68e353d31f',
    updatedAt: new Date('2024-05-22T17:00:24.321Z'),
    userId: 'eab57d50-b523-479b-a20e-fa9a14ae201f',
  },
  {
    _id: '2c4244cd-300a-4bae-b6c6-0aaafe20d62c',
    __v: 0,
    content: 'soy muy egocentrica',
    createdAt: new Date('2024-05-24T07:33:20.096Z'),
    postId: '09840bc1-ca0f-4d2f-9a7e-89329c3aea14',
    updatedAt: new Date('2024-05-24T07:33:20.096Z'),
    userId: 'eab57d50-b523-479b-a20e-fa9a14ae201f',
  },
]);


db.posts.insertMany([
  {
    _id: '90512b25-ffd7-4f91-9333-72ab843514b2',
    __v: 0,
    comments: [],
    createdAt: new Date('2024-04-25T09:00:42.424Z'),
    likes: ['eab57d50-b523-479b-a20e-fa9a14ae201f', 'f280aaea-04b2-42cd-b0c1-bcba503d88c9'],
    location: 'Aeropuerto Barajas de Madrid',
    photos: [
      'http://localhost:3000/photos/1714035642393_image1.jpeg',
      'http://localhost:3000/photos/1714035642397_image0.jpeg',
    ],
    title: 'Después de un largo dia de viaje, empieza mi nueva vida!!',
    updatedAt: new Date('2024-05-22T10:09:58.731Z'),
    userId: 'ad50696b-84e7-48ef-acff-c55e51555444',
  },
  {
    _id: 'd08939f3-edcd-40c9-8349-9c290409c8b1',
    __v: 0,
    comments: [],
    createdAt: new Date('2024-04-25T09:03:36.938Z'),
    likes: ['eab57d50-b523-479b-a20e-fa9a14ae201f', 'ad50696b-84e7-48ef-acff-c55e51555444'],
    location: 'Amsterdam',
    photos: [
      'http://localhost:3000/photos/1714035816916_image0(1).jpeg',
      'http://localhost:3000/photos/1714035816920_image4.jpeg',
      'http://localhost:3000/photos/1714035816924_image3.jpeg',
      'http://localhost:3000/photos/1714035816928_image2.jpeg',
      'http://localhost:3000/photos/1714035816933_image1(1).jpeg',
    ],
    title: 'Boat trip... chu chu!',
    updatedAt: new Date('2024-05-22T09:52:36.034Z'),
    userId: 'ad50696b-84e7-48ef-acff-c55e51555444',
  },
  {
    _id: '2852e84f-32d6-4204-b632-aa37972ddc56',
    __v: 0,
    comments: [],
    createdAt: new Date('2024-04-25T09:17:53.446Z'),
    likes: ['ad50696b-84e7-48ef-acff-c55e51555444', '7ec16af6-c69e-4883-8698-836c9bc2cda9', 'eab57d50-b523-479b-a20e-fa9a14ae201f'],
    location: 'Bruselas, Bélgica',
    photos: [
      'http://localhost:3000/photos/1710865285876_Capturadepantalla2024-03-19171944.png',
      'http://localhost:3000/photos/1710866077924_Capturadepantalla2024-03-19171921.png',
      'http://localhost:3000/photos/1711971233506_Capturadepantalla2024-03-19171956.png',
      'http://localhost:3000/photos/1711971608691_Capturadepantalla2024-03-19171935.png',
      'http://localhost:3000/photos/1711893328215_Capturadepantalla2024-03-19172029.png',
    ],
    title: 'Bruselas es precioso',
    updatedAt: new Date('2024-05-22T09:52:36.038Z'),
    userId: 'eab57d50-b523-479b-a20e-fa9a14ae201f',
  },
  {
    _id: 'a1830610-679f-40cc-baba-1fa1e5170935',
    __v: 0,
    comments: [],
    createdAt: new Date('2024-04-25T09:46:59.320Z'),
    likes: ['ad50696b-84e7-48ef-acff-c55e51555444', '7ec16af6-c69e-4883-8698-836c9bc2cda9', 'eab57d50-b523-479b-a20e-fa9a14ae201f'],
    location: 'A Coruña, Galicia',
    photos: [
      'http://localhost:3000/photos/1714038419291_IMG_5971.jpg',
      'http://localhost:3000/photos/1714038419294_IMG_5979.jpg',
      'http://localhost:3000/photos/1714038419300_IMG_5996.jpg',
      'http://localhost:3000/photos/1714038419305_IMG_5945.jpg',
      'http://localhost:3000/photos/1714038419309_IMG_6031.jpg',
      'http://localhost:3000/photos/1714038419312_IMG_5965.jpg',
    ],
    title: 'Galicia se llevó mi corazoncito',
    updatedAt: new Date('2024-05-22T16:59:25.703Z'),
    userId: 'eab57d50-b523-479b-a20e-fa9a14ae201f',
  },
  {
    _id: 'a25e7b1f-0c38-4487-85c4-da68e353d31f',
    __v: 0,
    comments: [],
    createdAt: new Date('2024-04-25T10:10:51.007Z'),
    likes: ['eab57d50-b523-479b-a20e-fa9a14ae201f'],
    location: 'Hofburg Palace, Viena',
    photos: [
      'http://localhost:3000/photos/1714039850998_2cfbd796-c508-4e1d-a5c8-ac4b55a10b7d.JPG',
      'http://localhost:3000/photos/1714039851001_952e8d3c-efdb-4a87-8ac3-12ae07f8bb87.JPG',
      'http://localhost:3000/photos/1714039851002_fca13afb-271e-47a8-9119-58579ebef8f2.JPG',
      'http://localhost:3000/photos/1714039851003_868a7a29-d315-4d75-bc8c-3778ca500048.JPG',
    ],
    title: 'Viena...',
    updatedAt: new Date('2024-05-22T17:00:20.867Z'),
    userId: 'ad50696b-84e7-48ef-acff-c55e51555444',
  },
  {
    _id: '18ec1e26-32ae-4b8f-9457-5d8a0700659a',
    __v: 0,
    comments: [],
    createdAt: new Date('2024-04-25T10:12:26.764Z'),
    likes: ['eab57d50-b523-479b-a20e-fa9a14ae201f'],
    location: 'Leeuwarden',
    photos: [
      'http://localhost:3000/photos/1714039946762_684beae7-df9c-4ef1-86a5-8c9b30a63694.JPG',
    ],
    title: 'trick or treat?',
    updatedAt: new Date('2024-05-22T09:52:36.053Z'),
    userId: 'ad50696b-84e7-48ef-acff-c55e51555444',
  },
  {
    _id: 'fc2145a4-1d3e-485d-ad3c-a3520526e4ef',
    __v: 0,
    comments: [],
    createdAt: new Date('2024-04-25T10:12:57.566Z'),
    likes: ['eab57d50-b523-479b-a20e-fa9a14ae201f', '7ec16af6-c69e-4883-8698-836c9bc2cda9', 'f280aaea-04b2-42cd-b0c1-bcba503d88c9'],
    location: 'Lillie, Francia',
    photos: [
      'http://localhost:3000/photos/1714039977561_28491e1e-c2d6-4358-a623-3fe619e4ff5f.JPG',
    ],
    title: 'Merry Christmas from Lille, France',
    updatedAt: new Date('2024-05-22T09:52:36.055Z'),
    userId: 'ad50696b-84e7-48ef-acff-c55e51555444',
  },
  {
    _id: '66fefa24-2fba-4aca-8714-ebff87202be1',
    __v: 0,
    comments: [],
    createdAt: new Date('2024-04-25T11:30:03.675Z'),
    likes: [],
    location: 'Amsterdam',
    photos: [
      'http://localhost:3000/photos/1714044603654_f2220415-277b-4f20-b0fc-6ab4f779c509.JPG',
      'http://localhost:3000/photos/1714044603667_a5e4cdd3-c4fa-4ec8-b915-e7cd6b8eaa15.JPG',
    ],
    title: 'Empieza la tulip season!!!!',
    updatedAt: new Date('2024-05-22T09:52:36.060Z'),
    userId: 'ad50696b-84e7-48ef-acff-c55e51555444',
  },
  {
    _id: 'ef4e4711-ed5d-45ab-9110-24df2857bb07',
    __v: 0,
    comments: [],
    createdAt: new Date('2024-04-25T11:37:30.814Z'),
    likes: ['7ec16af6-c69e-4883-8698-836c9bc2cda9'],
    location: 'Museo de Van Gogh',
    photos: [
      'http://localhost:3000/photos/1714045050762_443fb02e-c8a2-45b1-bc32-4c0deb7db72a.JPG',
    ],
    title: '"La normalidad es un camino pavimentado. Es cómodo para caminar, pero no crecen flores en él." Van Gogh',
    updatedAt: new Date('2024-05-22T09:52:36.062Z'),
    userId: 'ad50696b-84e7-48ef-acff-c55e51555444',
  },
  {
    _id: '05ccc5ab-224b-469d-b317-6a0079407e4f',
    __v: 0,
    comments: [],
    createdAt: new Date('2024-04-28T09:33:42.100Z'),
    likes: ['f280aaea-04b2-42cd-b0c1-bcba503d88c9', 'eab57d50-b523-479b-a20e-fa9a14ae201f'],
    location: 'Madrid',
    photos: [
      'http://localhost:3000/photos/1714296822041_IMG_8720.JPG',
      'http://localhost:3000/photos/1714296822052_IMG_8718.JPG',
      'http://localhost:3000/photos/1714296822068_IMG_8719.JPG',
      'http://localhost:3000/photos/1714296822078_IMG_8715.JPG',
      'http://localhost:3000/photos/1714296822088_IMG_8672.JPG',
    ],
    title: 'Echando de menos a mi mejor amiga... que duro es a veces! En nada reunidas de nuevo',
    updatedAt: new Date('2024-05-25T14:14:18.888Z'),
    userId: 'ad50696b-84e7-48ef-acff-c55e51555444',
  },
  {
    _id: 'a6287295-0635-4178-878e-ade7194bffaa',
    __v: 0,
    comments: [],
    createdAt: new Date('2024-04-28T09:43:15.885Z'),
    likes: ['ad50696b-84e7-48ef-acff-c55e51555444', 'eab57d50-b523-479b-a20e-fa9a14ae201f'],
    location: 'Valencia',
    photos: [
      'http://localhost:3000/photos/1714297395878_image0.jpeg',
    ],
    title: '🔜🔜🔜',
    updatedAt: new Date('2024-05-22T09:52:36.065Z'),
    userId: 'f280aaea-04b2-42cd-b0c1-bcba503d88c9',
  },
  {
    _id: '54114360-d429-48a9-8aa5-91a1b6cae220',
    __v: 0,
    comments: [],
    createdAt: new Date('2024-04-28T09:48:30.563Z'),
    likes: ['ad50696b-84e7-48ef-acff-c55e51555444', 'eab57d50-b523-479b-a20e-fa9a14ae201f'],
    location: 'Tenerife',
    photos: [
      'http://localhost:3000/photos/1714297710552_image1.jpeg',
      'http://localhost:3000/photos/1714297710556_image2.jpeg',
    ],
    title: 'por las islitas',
    updatedAt: new Date('2024-05-22T10:07:22.783Z'),
    userId: 'f280aaea-04b2-42cd-b0c1-bcba503d88c9',
  },
  {
    _id: '33f6ea1b-eb5b-43b2-9e8c-0c5fb8026b1f',
    __v: 0,
    comments: [],
    createdAt: new Date('2024-04-28T09:50:09.172Z'),
    likes: ['eab57d50-b523-479b-a20e-fa9a14ae201f'],
    location: 'Valle de los Caídos',
    photos: [
      'http://localhost:3000/photos/1714297809165_image3.jpeg',
    ],
    title: '',
    updatedAt: new Date('2024-05-22T10:58:02.788Z'),
    userId: 'f280aaea-04b2-42cd-b0c1-bcba503d88c9',
  },
  {
    _id: 'b351f4ba-f545-4f00-896d-fe3f0a2b1018',
    __v: 0,
    comments: [],
    createdAt: new Date('2024-04-28T09:54:33.338Z'),
    likes: ['eab57d50-b523-479b-a20e-fa9a14ae201f'],
    location: 'Warner Bross',
    photos: [
      'http://localhost:3000/photos/1714298073335_image8.jpeg',
    ],
    title: 'Foto histórica si me lo permites',
    updatedAt: new Date('2024-05-22T10:07:04.926Z'),
    userId: 'f280aaea-04b2-42cd-b0c1-bcba503d88c9',
  },
  {
    _id: '1ed6ec16-df88-458e-86b3-34467c7b1f63',
    __v: 0,
    comments: [],
    createdAt: new Date('2024-04-28T09:55:00.888Z'),
    likes: ['eab57d50-b523-479b-a20e-fa9a14ae201f'],
    location: 'Desierto del Sahara, Marruecos',
    photos: [
      'http://localhost:3000/photos/1714298100883_image10.jpeg',
    ],
    title: 'Tu jeque de confianza',
    updatedAt: new Date('2024-05-22T10:08:13.359Z'),
    userId: 'f280aaea-04b2-42cd-b0c1-bcba503d88c9',
  },
  {
    _id: '51e46287-78e4-4eb2-93c1-958999044bec',
    __v: 0,
    comments: [],
    createdAt: new Date('2024-04-28T09:55:22.905Z'),
    likes: ['ad50696b-84e7-48ef-acff-c55e51555444'],
    location: 'Marruecos',
    photos: [
      'http://localhost:3000/photos/1714298122896_image11.jpeg',
      'http://localhost:3000/photos/1714298122899_image12.jpeg',
    ],
    title: 'Un jeque polivalente',
    updatedAt: new Date('2024-05-22T10:07:14.629Z'),
    userId: 'f280aaea-04b2-42cd-b0c1-bcba503d88c9',
  },
  {
    _id: '96ce85d8-df42-4cca-a4b1-54db0c4b888d',
    __v: 0,
    comments: [],
    createdAt: new Date('2024-04-28T09:55:59.547Z'),
    likes: ['ad50696b-84e7-48ef-acff-c55e51555444', 'eab57d50-b523-479b-a20e-fa9a14ae201f'],
    location: 'Estadio Cívitas Metropolitano',
    photos: [
      'http://localhost:3000/photos/1714298159541_image13.jpeg',
      'http://localhost:3000/photos/1714298159543_image14.jpeg',
    ],
    title: 'Con la mejor🫶',
    updatedAt: new Date('2024-05-22T10:08:42.864Z'),
    userId: 'f280aaea-04b2-42cd-b0c1-bcba503d88c9',
  },
]);


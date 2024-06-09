CREATE TABLE IF NOT EXISTS public.users (
                                            id UUID PRIMARY KEY,
                                            name VARCHAR(255) NOT NULL,
                                            lastname VARCHAR(255) NOT NULL,
                                            username VARCHAR(255) UNIQUE NOT NULL,
                                            password VARCHAR(255) NOT NULL,
                                            email VARCHAR(255) UNIQUE NOT NULL,
                                            image VARCHAR(255),
                                            role VARCHAR(255) NOT NULL,
                                            created_at TIMESTAMP DEFAULT now() NOT NULL,
                                            updated_at TIMESTAMP DEFAULT now() NOT NULL
);


INSERT INTO public.users (id, name, lastname, username, password, email, image, role, created_at, updated_at) VALUES ('ad50696b-84e7-48ef-acff-c55e51555444', 'Laura', 'López Clemente', 'lau.lpz__', '$2a$12$iWqKRrZpY55uLyQ4sWCC4efF7IyFxpW5jzESyOe.HQnJ7/RooqssG', 'lauralopezclemente@gmail.com', 'http://localhost:3000/photos/1714211075564_image0.jpeg', 'user', '2024-04-25 08:08:12.352003', '2024-04-27 09:44:35.763932');
INSERT INTO public.users (id, name, lastname, username, password, email, image, role, created_at, updated_at) VALUES ('eab57d50-b523-479b-a20e-fa9a14ae201f', 'Eva', 'Gómez Uceda', 'evagmezz', '$2a$12$a2K3BfFCLY7Mc/oIBM7BNeuIwZZtoE2fM6p3VJuuVHVYFgjvhSi3q', 'evagomez@gmail.com', 'http://localhost:3000/photos/1714211306357_Capturadepantalla2024-03-27154757.png', 'admin', '2024-04-25 07:05:48.703689', '2024-04-27 09:48:26.564404');
INSERT INTO public.users (id, name, lastname, username, password, email, image, role, created_at, updated_at) VALUES ('f280aaea-04b2-42cd-b0c1-bcba503d88c9', 'Gonzalo', 'Rojas Fernández', 'goncho2298', '$2a$12$Mu3VDpD3SeyNwix4DCdqwO0eINSehrpjVg9lzsHZ1W/R2nsPQ4DzG', 'gonzalo.rojas@gmail.com', 'http://localhost:3000/photos/1714297306561_image1.jpeg', 'user', '2024-04-26 12:24:18.703249', '2024-04-28 09:41:46.785402');
CREATE TABLE IF NOT EXISTS public.users_followers_users (
                                                            "usersId_1" UUID NOT NULL,
                                                            "usersId_2" UUID NOT NULL,
                                                            PRIMARY KEY ("usersId_1", "usersId_2"),
                                                           FOREIGN KEY ("usersId_1") REFERENCES public.users (id) ON DELETE CASCADE, FOREIGN KEY ("usersId_2") REFERENCES public.users (id) ON DELETE CASCADE
);

INSERT INTO public.users_followers_users ("usersId_1", "usersId_2") VALUES ('eab57d50-b523-479b-a20e-fa9a14ae201f', 'ad50696b-84e7-48ef-acff-c55e51555444');
INSERT INTO public.users_followers_users ("usersId_1", "usersId_2") VALUES ('eab57d50-b523-479b-a20e-fa9a14ae201f', 'f280aaea-04b2-42cd-b0c1-bcba503d88c9');
INSERT INTO public.users_followers_users ("usersId_1", "usersId_2") VALUES ('ad50696b-84e7-48ef-acff-c55e51555444', 'f280aaea-04b2-42cd-b0c1-bcba503d88c9');
INSERT INTO public.users_followers_users ("usersId_1", "usersId_2") VALUES ('f280aaea-04b2-42cd-b0c1-bcba503d88c9', 'ad50696b-84e7-48ef-acff-c55e51555444');
INSERT INTO public.users_followers_users ("usersId_1", "usersId_2") VALUES ('ad50696b-84e7-48ef-acff-c55e51555444', 'eab57d50-b523-479b-a20e-fa9a14ae201f');
INSERT INTO public.users_followers_users ("usersId_1", "usersId_2") VALUES ('f280aaea-04b2-42cd-b0c1-bcba503d88c9', 'eab57d50-b523-479b-a20e-fa9a14ae201f');
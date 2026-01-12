# Portal Διαχείρισης & Σύνθεσης Ομάδων Εργασίας

![Node.js](https://img.shields.io/badge/Node.js-v24-green?logo=node.js)
![Express.js](https://img.shields.io/badge/Express.js-5.2.1-lightgrey?logo=express)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-7.2.0-2D3748?logo=prisma)
![Socket.io](https://img.shields.io/badge/Socket.io-4.8.3-black?logo=socket.io)

**Μάθημα:** Υπηρεσιοστρεφές Λογισμικό (Ακαδημαϊκό Έτος 2025-2026)

## 👥 Στοιχεία Ομάδας

* **Ονοματεπώνυμο:** Κυριάκος Πετρόπουλος
  **ΑΜ:** Π22141

---

## 📝 Περιγραφή Εφαρμογής

Η εφαρμογή αποτελεί ένα αλληλεπιδραστικό υπηρεσιοστρεφές λογισμικό για τη διαχείριση και σύνθεση ομάδων εργασίας. Επιτρέπει στους χρήστες να αναζητούν συνεργάτες με βάση κοινά ενδιαφέροντα και μαθήματα μέσω ενός συστήματος κατηγοριοποιημένων αναρτήσεων.

---

## 🚀 Βασικές Λειτουργίες

1. **Αναρτήσεις (Posts)**
   * Δημιουργία, προβολή και αναζήτηση posts.
   * Κατηγοριοποίηση: Hobby, Study, Team.

2. **Επαφές**
   * Αναζήτηση χρηστών βάσει username.
   * Προσθήκη χρηστών ως προσωπικές επαφές (Buddies).

3. **Σύνδεση Χρηστών**

   * Local Auth: Με email/password.
   * 3rd Party Login: Σύνδεση μέσω Google OAuth 2.0.

4. **Μηνύματα**

   * Προσωπικές συνομιλίες
   * Ομαδικές συνομιλίες
   * Εμφάνιση συνομιλιών σε popup παράθυρα

5. **Ειδοποιήσεις**
   * Ειδοποίηση για νέα μηνύματα.
   * Άμεση ενημέρωση όταν ένας buddy δημιουργεί μία νέα δημοσίευση (post).

---

## 🛠️ Τεχνολογικό Stack

* **Runtime:** Node.js (v24)
* **Backend Framework:** Express.js, TypeScript
* **Database & ORM:** PostgreSQL με Prisma ORM
* **Real-time Engine:** Socket.io
* **Authentication:** Local JWT ,Passport.js (JWT & Google Strategy), bcrypt
* **Frontend:** Vanilla JavaScript (Client-side rendering), HTML, CSS

---

## 📁 Δομή Φακέλων

```text
project-root/
│
├── prisma/ 
    └── schema.prisma   # Database 
│
├── public/             # Client κώδικας
│
├── src/                # Server κώδικας
│
├── .env
├── .prettierrc
├── package-lock.json
├── package.json
├── prisma.config.ts
└── tsconfig.json
```

---

## ⚙️ Οδηγίες Εγκατάστασης & Λειτουργίας

### 1️⃣ Κατέβασμα του Project

```bash
git clone <git@github.com:kyriakos20042/UniFlow.git>
cd <UniFlow>
```

---

### 2️⃣ Εγκατάσταση Πακέτων

```bash
npm install
```

---

### 3️⃣ Ρύθμιση Αρχείου .env

Στο βασικό φάκελο του project δημιουργούμε ένα αρχείο `.env` και βάζουμε τα παρακάτω:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
JWT_SECRET="your_jwt_secret"

GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
GOOGLE_CALLBACK_URL="http://localhost:3000/auth/google/callback"
```

---

### 4️⃣ Βάση Δεδομένων

Τρέχουμε τις παρακάτω εντολές για να στηθεί η βάση:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

---

### 5️⃣ Εκκίνηση Εφαρμογής

```bash
npm run dev
```

Ο server τρέχει στο:
`http://localhost:3000`

Το frontend ανοίγει από τον ίδιο server και βρίσκεται στον φάκελο `public/`.

---

## 📌 Σημειώσεις

* Απαιτείται Node.js v24
* Το Google Login χρειάζεται ρύθμιση στο Google Cloud Console
* Το αρχείο `.env` δεν ανεβαίνει στο repository

---

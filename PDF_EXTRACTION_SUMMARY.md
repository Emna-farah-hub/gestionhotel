# TP5 Angular: L'authentification et les droits d'accès dans Angular

## Objectifs

- ✅ Créer une page de login
- ✅ Création du Service Auth
- ✅ Contextualisation du menu
- ✅ Création d'un guard
- ✅ Utilisation de LocalStorage

---

## Partie 1: Créer une page de login

### Étape 1: Créer le composant Web login

```bash
ng g c login --skip-tests --inline-style
```

### Étape 2: Ajouter le component login au fichier app-routing.module.ts

```typescript
{path: 'login', component: Login},
{path: '', redirectTo: 'lhotels', pathMatch: 'full'}
```

### Étape 3: Créer dans le dossier model, la classe User

```typescript
export class User {
  username: string;
  password: string;
  roles: string[];
}
```

### Étape 4: Ajouter l'attribut user à la classe Login

```typescript
user = new User();
```

### Étape 5: Ajouter la méthode onLoggedin() à la classe Login

```typescript
onLoggedin() {
  console.log(this.user);
}
```

### Étape 6: Editer le fichier login.html

```html
<div class="container mt-5">
  <div class="row justify-content-md-center">
    <div class="col-md-4">
      <form>
        <div class="form-group">
          <label>Nom Utilisateur :</label>
          <input type="text" name="username" class="form-control" [(ngModel)]="user.username" />
        </div>
        <div class="form-group">
          <label>Mot de passe:</label>
          <input type="password" name="password" [(ngModel)]="user.password" class="form-control" />
        </div>
        <div class="row justify-content-md-center">
          <button type="button" (click)="onLoggedin()" class="btn btn-success">Connexion</button>
        </div>
      </form>
    </div>
  </div>
</div>
```

### Étape 7: Tester votre travail

Accéder à: `http://localhost:4200/login`

---

## Partie 2: Création du Service Auth

### Étape 8: Accéder au dossier services, et créer le service auth

```bash
cd .\src\app\services\
ng g service auth
```

### Étape 9: Modifier le fichier auth.service.ts

```typescript
users: User[] = [
  {"username": "admin", "password": "123", "roles": ['ADMIN']},
  {"username": "kais", "password": "123", "roles": ['USER']}
];

public loggedUser: string;
public isloggedIn: Boolean = false;
public roles: string[];

constructor(private router: Router) {}

logout() {
  this.isloggedIn = false;
  this.loggedUser = undefined;
  this.roles = undefined;
  localStorage.removeItem('loggedUser');
  localStorage.setItem('isloggedIn', String(this.isloggedIn));
  this.router.navigate(['/login']);
}

SignIn(user: User): Boolean {
  let validUser: Boolean = false;
  this.users.forEach((curUser) => {
    if(user.username === curUser.username && user.password == curUser.password) {
      validUser = true;
      this.loggedUser = curUser.username;
      this.isloggedIn = true;
      this.roles = curUser.roles;
      localStorage.setItem('loggedUser', this.loggedUser);
      localStorage.setItem('isloggedIn', String(this.isloggedIn));
    }
  });
  return validUser;
}

isAdmin(): Boolean {
  if(!this.roles) // this.roles == undefined
    return false;
  return (this.roles.indexOf('ADMIN') > -1);
}
```

### Étape 10: Modifier la méthode onLoggedin() de la classe Login

```typescript
constructor(private authService: AuthService,
            private router: Router) {}

onLoggedin() {
  console.log(this.user);
  let isValidUser: Boolean = this.authService.SignIn(this.user);
  if(isValidUser)
    this.router.navigate(['/']);
  else
    alert('Login ou mot de passe incorrecte!');
}
```

### Étape 11: Tester votre travail

Accéder à: `http://localhost:4200/login`

### Étape 12: Ajouter ces lignes au fichier login.html

```html
<div class="row justify-content-md-center">
  <div class="col-md-4">
    <div class="alert alert-danger" *ngIf="erreur==1">
      <strong>login ou mot de passe erronés..</strong>
    </div>
    <form></form>
  </div>
</div>
```

### Étape 13: Ajouter l'attribut erreur à la classe Login

```typescript
erreur = 0;
```

### Étape 14: Modifier la méthode onLoggedin() comme suit

```typescript
else
  // alert('Login ou mot de passe incorrecte!');
  this.erreur = 1;
```

---

## Partie 3: Contextualisation du menu

### Afficher l'utilisateur connecté

### Étape 15: Modifier la classe App

```typescript
constructor(public authService: AuthService) {}
```

### Étape 16: Modifier le fichier app.component.html

```html
<ul class="navbar-nav ml-auto">
  <li><a class="nav-link">{{authService.loggedUser}}</a></li>
  <li class="nav-item dropdown"></li>
</ul>
```

### Seulement les utilisateurs qui ont le rôle ADMIN peuvent ajouter des Hotels

Donc on va cacher le menu "Ajouter" aux utilisateurs qui ne sont pas des admin.

### Étape 17: Modifier le fichier app.html

```html
<a *ngIf="authService.isAdmin()" class="dropdown-item" routerLink="/add-Hotels">Ajouter</a>
```

### Seulement les utilisateurs qui ont le rôle ADMIN peuvent modifier et supprimer des produits

### Étape 18: Modifier la classe Hotels

```typescript
constructor(private hoteltService: HotelService,
            public authService: AuthService) {}
```

### Étape 19: Modifier le fichier hotel.html

```html
<td>
  <a *ngIf="authService.isAdmin()" class="btn btn-danger" (click)="supprimerHotel(hotel)"
    >Supprimer</a
  >
</td>
<td>
  <a *ngIf="authService.isAdmin()" class="btn btn-success" [routerLink]="['/updateHotel', hotel.id]"
    >Modifier</a
  >
</td>
```

### Cacher ou Montrer les commandes «Login» et «Logout» selon qu'on est connecté ou pas connecté

### Étape 20: Modifier le fichier app.component.html

```html
<a *ngIf="!authService.isloggedIn" class="dropdown-item" routerLink="login">login</a>
<a *ngIf="authService.isloggedIn" class="dropdown-item" (click)="onLogout()">logout</a>
```

### Étape 21: Ajouter la méthode onLogout() dans la classe App

```typescript
onLogout() {
  console.log("logout-------1");
  this.authService.logout();
}
```

---

## Partie 4: Création d'un guard

### Test préliminaire

Connectez-vous en tant qu'un utilisateur non admin puis essayez d'accéder au formulaire d'ajout de hotel:
`http://localhost:4200/add-Hotel`
Est-ce que vous pouvez le faire ?

### Étape 22: Créer un guard avec la commande

```bash
ng g guard Hotel
```

Choisir l'option par défaut (CanActivate)

### Étape 23: Créer un web component forbidden pour afficher le message «Vous n'êtes pas autorisé…»

```bash
ng g c forbidden
```

### Étape 24: Modifier le fichier app-routing.module.ts

```typescript
{path: 'app-forbidden', component: ForbiddenComponent},
```

### Étape 25: Modifier le fichier forbidden.component.html comme suit

```html
<div class="alert alert-danger">
  <strong>Vous n'êtes pas autorisé…</strong>
</div>
```

### Étape 26: Modifier le fichier app-routing.module.ts

```typescript
{ path: 'add-Hotels', component: AjoutHotel, canActivate: [hotelGuard] },
```

### Étape 27: Tester

Connectez-vous en tant qu'un utilisateur non admin puis essayez d'accéder au formulaire d'ajout de hotel:
`http://localhost:4200/add-hotel`

---

## Partie 5: Utilisation de LocalStorage

Au démarrage de l'application on teste LocalStorage pour voir si l'utilisateur n'est pas déjà connecté, dans ce cas on redirige vers login.

### Étape 28: Modifier la classe App

```typescript
ngOnInit() {
  let isloggedin: string;
  let loggedUser: string;
  isloggedin = localStorage.getItem('isloggedIn');
  loggedUser = localStorage.getItem('loggedUser');
  if(isloggedin != "true" || !loggedUser)
    this.router.navigate(['/login']);
  else
    this.authService.setLoggedUserFromLocalStorage(loggedUser);
}
```

### Étape 29: Modifier le fichier auth.service.ts comme suit

```typescript
setLoggedUserFromLocalStorage(login: string) {
  this.loggedUser = login;
  this.isloggedIn = true;
  this.getUserRoles(login);
}

getUserRoles(username: string) {
  this.users.forEach((curUser) => {
    if(curUser.username == username) {
      this.roles = curUser.roles;
    }
  });
}
```

---

## Note supplémentaire

Pour exécuter le serveur Angular et json-server simultanément, ajouter dans package.json:

```json
"concurrently \"ng serve --o\" \"json-server --watch src/db.json\""
```

---

**Auteur:** Boukattaya kais

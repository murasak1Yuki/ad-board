import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, map, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '@models/user.model';
import { AuthResponseData } from '@models/auth-response-data.model';
import { RefreshTokenResponseData } from '@models/refresh-token-response-data.model';
import { UserInfoModel } from '@models/user-info.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<User | null>(null);
  private tokenExpirationTime!: ReturnType<typeof setTimeout> | null;

  constructor(private _http: HttpClient, private _router: Router) {}

  signup(email: string, password: string) {
    return this._http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
          environment.firebaseConfig.apiKey,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleAuthError),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            resData.refreshToken,
            +resData.expiresIn
          );
        })
      );
  }

  login(email: string, password: string) {
    return this._http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
          environment.firebaseConfig.apiKey,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleAuthError),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            resData.refreshToken,
            +resData.expiresIn
          );
        })
      );
  }

  storeUserInfo(userInfo: UserInfoModel) {
    this._http
      .post<{ [userDtoId: string]: string }>(
        environment.firebaseConfig.databaseURL + '/users.json',
        userInfo
      )
      .subscribe();
  }

  getUsersInfo() {
    return this._http
      .get<Record<string, UserInfoModel>>(
        environment.firebaseConfig.databaseURL + '/users.json'
      )
      .pipe(
        map((res) => {
          return Object.entries(res).map(([id, userInfo]) => {
            userInfo.userInfoId = id;
            return userInfo;
          });
        })
      );
  }

  updateUserInfo(id: string, newUserInfo: UserInfoModel) {
    return this._http
      .patch<UserInfoModel>(
        `${environment.firebaseConfig.databaseURL}/users/${id}.json`,
        newUserInfo
      )
      .pipe(catchError(this.handleUserInfoError));
  }

  changePassword(newPassword: string) {
    return this._http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:update?key=' +
        environment.firebaseConfig.apiKey,
      {
        idToken: this.user.value?.token,
        password: newPassword,
        returnSecureToken: true,
      }
    ).pipe(
      catchError(this.handleAuthError),
      tap(resData => {
        this.handleAuthentication(
          resData.email,
          resData.localId,
          resData.idToken,
          resData.refreshToken,
          +resData.expiresIn,
        )
      })
    );
  }

  logout() {
    this.user.next(null);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTime) {
      clearTimeout(this.tokenExpirationTime);
    }
    this.tokenExpirationTime = null;
    this._router.navigateByUrl('');
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      userInfo: UserInfoModel;
      refreshToken: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData')!);
    if (!userData) {
      return;
    }
    const loadedUser = new User(
      userData.email,
      userData.id,
      userData.userInfo,
      userData.refreshToken,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );
    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this._autoRefreshIdToken(expirationDuration, loadedUser);
    }
  }

  private _refreshIdToken(refreshToken: string) {
    return this._http.post<RefreshTokenResponseData>(
      'https://securetoken.googleapis.com/v1/token?key=' +
        environment.firebaseConfig.apiKey,
      {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }
    );
  }

  private _autoRefreshIdToken(expirationDuration: number, user: User) {
    const refreshTimeMs = expirationDuration - 5 * 60 * 1000;
    this.tokenExpirationTime = setTimeout(() => {
      this._refreshIdToken(user.refreshToken).subscribe({
        next: (resData) => {
          const refreshedUser = new User(
            user.email,
            user.id,
            user.userInfo,
            resData.refresh_token,
            resData.id_token,
            new Date(new Date().getTime() + +resData.expires_in * 1000)
          );
          this.user.next(refreshedUser);
          localStorage.setItem('userData', JSON.stringify(refreshedUser));
        },
      });
    }, refreshTimeMs);
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    refreshToken: string,
    expiresIn: number
  ) {
    this.getUsersInfo().subscribe((usersInfo) => {
      const currentUserInfo = usersInfo.find((userInfo) => {
        return userInfo.userId === userId;
      })!;
      const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
      const user = new User(
        email,
        userId,
        currentUserInfo,
        refreshToken,
        token,
        expirationDate
      );
      this.user.next(user);
      this._autoRefreshIdToken(expiresIn * 1000, user);
      localStorage.setItem('userData', JSON.stringify(user));
    });
  }

  private handleUserInfoError(errorRes: HttpErrorResponse) {
    const errorMessageMap: { [errorCode: number]: string } = {
      0: 'Произошла неизвестная ошибка.',
      400: 'Некорректный запрос.',
      401: 'Пользователь не авторизован для выполнения желаемого действия.',
      404: 'База данных не была найдена.',
    };
    return throwError(() => errorMessageMap[errorRes.status]);
  }

  private handleAuthError(errorRes: HttpErrorResponse) {
    const errorMessageMap: { [errorCode: string]: string } = {
      EMAIL_EXISTS: 'Данный адрес электронной почты уже существует.',
      EMAIL_NOT_FOUND: 'Этой электронной почты не существует.',
      INVALID_PASSWORD: 'Этот пароль неверен.',
    };
    const errorMessage =
      !errorRes.error || !errorRes.error.error
        ? 'Произошла неизвестная ошибка.'
        : errorMessageMap[errorRes.error.error.message];
    return throwError(() => errorMessage);
  }
}

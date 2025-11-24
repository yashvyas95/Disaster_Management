import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LocalStorageService } from 'ngx-webstorage';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let localStorageMock: jasmine.SpyObj<LocalStorageService>;

  beforeEach(() => {
    const storageSpy = jasmine.createSpyObj('LocalStorageService', ['store', 'retrieve', 'clear']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: LocalStorageService, useValue: storageSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorageMock = TestBed.inject(LocalStorageService) as jasmine.SpyObj<LocalStorageService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should send POST request to login endpoint with credentials', () => {
      const mockCredentials = { username: 'admin', password: 'Admin@123' };
      const mockResponse = {
        authenticationToken: 'mock-token',
        username: 'admin',
        refreshToken: 'mock-refresh',
        expiresAt: new Date()
      };

      service.login(mockCredentials).subscribe(response => {
        expect(response).toBe(true);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockCredentials);
      req.flush(mockResponse);

      expect(localStorageMock.store).toHaveBeenCalledWith('authenticationToken', mockResponse.authenticationToken);
      expect(localStorageMock.store).toHaveBeenCalledWith('username', mockResponse.username);
    });
  });

  describe('isLoggedIn', () => {
    it('should return true when token exists', () => {
      localStorageMock.retrieve.and.returnValue('mock-token');
      expect(service.isLoggedIn()).toBe(true);
    });

    it('should return false when token does not exist', () => {
      localStorageMock.retrieve.and.returnValue(null);
      expect(service.isLoggedIn()).toBe(false);
    });
  });

  describe('logout', () => {
    it('should clear all tokens from localStorage', () => {
      service.logout();

      expect(localStorageMock.clear).toHaveBeenCalledWith('authenticationToken');
      expect(localStorageMock.clear).toHaveBeenCalledWith('username');
      expect(localStorageMock.clear).toHaveBeenCalledWith('refreshToken');
      expect(localStorageMock.clear).toHaveBeenCalledWith('expiresAt');
      expect(localStorageMock.clear).toHaveBeenCalledWith('role');
      expect(localStorageMock.clear).toHaveBeenCalledWith('department');
    });
  });
});

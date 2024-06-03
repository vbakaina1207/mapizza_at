export interface IVacancyRequest {
    name: string;
    path: string;
    description: string;
    imagePath: string;
}

export interface IVacancyResponse extends IVacancyRequest {
    id:  string;
}

import { Routes } from '@angular/router';
import { PostComponent } from './post/post.component';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';
import { SubjectDetailComponent } from './subject-detail/subject-detail.component';

export const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'post', component: PostComponent },
	{ path: 'search', component: SearchComponent },
	{ path: 'subjects/:id', component: SubjectDetailComponent },
];

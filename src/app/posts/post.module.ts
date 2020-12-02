import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FroalaEditorModule, FroalaViewModule } from "angular-froala-wysiwyg";

import { PostListingComponent } from "./list.component";
import { PostCreateComponent } from "./create.component";
import { PostUpdateComponent } from "./update.component";

import { PostService } from "./service";

const routes: Routes = [
  {
    path: "",
    component: PostListingComponent,
    data: {
      title: "Manage pages",
      urls: [{ title: "Pages", url: "/posts" }, { title: "Listing" }],
    },
  },
  // {
  //   path: 'create',
  //   component: PostCreateComponent,
  //   data: {
  //     title: 'Manage pages',
  //     urls: [{ title: 'Pages', url: '/posts' }, { title: 'Create new page' }]
  //   }
  // },
  {
    path: "update/:id",
    component: PostUpdateComponent,
    data: {
      title: "Manage pages",
      urls: [{ title: "Pages", url: "/posts" }, { title: "Update page" }],
    },
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    RouterModule.forChild(routes),
    FroalaEditorModule,
    FroalaViewModule,
  ],
  declarations: [
    PostListingComponent,
    PostCreateComponent,
    PostUpdateComponent,
  ],
  providers: [PostService],
  exports: [],
  entryComponents: [],
})
export class PostModule {}

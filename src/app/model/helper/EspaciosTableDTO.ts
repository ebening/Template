
/**
* Created by Jose Gonzalez
* 15 / 01 / 2017
*/

export class EspaciosTableDTO {
    
    public size : number = 10;
    public page : number;

    public data : any;
    public content : any[] = [];

    public pagination : number[] = [];

    //funcion para validar si se muestra el componente de validacion
    public needPagination(){
        return (this.data && this.data.totalPages > 1) ? 1 : 0;
    }

    public buildFromData(e){
        this.data = e;
        this.content = e.content;
        this.page = e.number;
        this.buildPagination();
    }

    public getPaginationString(){
        return `?page=${this.page}&size=${this.size}`;
    }

    buildPagination(){
        let p : number[] = [];
        //si estoy en la primera pagina
        if(this.page == 0){
            let max =0;
            if(this.data.totalPages > (this.page + 2)){
                max = this.page + 3;
            }else{
                max = this.data.totalPages;
            }
            for(let i = this.page; i < (max) ; i++){
                p.push(i);
            }
        //si estoy en la ultima pagina
        }else if(this.page == (this.data.totalPages -1)){
            //si solo tengo dos paginas, pinto solo 2 y 1
            if( (this.page - 2) < 0){
                console.log("menos paginas de lo normal, a cero")
                for(let i = 0; i < (this.page+1); i++){
                    p.push(i);
                }
            //si tengo mas, las pinto todas
            }else{
                let min = this.page - 2;                
                for(let i = min; i < (this.page+1) ; i++){
                    p.push(i);
                }
            }
        }else{
            for(let i = (this.page-1); i < (this.page+2) ; i++){
                p.push(i);
            }
        }
        this.pagination = p;
    }
}

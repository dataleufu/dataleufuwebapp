import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import { API_BASE_URL } from './config';
import 'rxjs/add/operator/toPromise';
import { Layer, INTERNAL_LAYER, Category } from './place';

@Injectable()
export class LayerService {

  private headers = new Headers({'Content-Type': 'application/json'});

  private apiUrl = API_BASE_URL + '/api_layers/';


  constructor(private http: Http) { }

  getLayers(): Promise<Layer[]> {
    var that = this;
    return this.http.get(this.apiUrl)
               .toPromise()
               .then(function(response){
                   return that.formatLayers(response.json().results as Layer[])
                })
               .catch(this.handleError);
  }

  formatLayers(layers: Layer[]): Layer[]{
    var that = this;
    layers.forEach( function(layer, indice, array) {
        that.formatLayer(layer);
        });
    return layers;
  }

  formatLayer(layer: Layer):void{
    if (layer.type == INTERNAL_LAYER && (layer.url == null || layer.url == "")){
        layer.url = API_BASE_URL + '/places/' + layer.category;
      }
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}


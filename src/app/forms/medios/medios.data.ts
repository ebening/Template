import { Select2OptionData } from 'ng2-select2/ng2-select2';

export const select2DefaultData: Select2OptionData[] = [{
  id: '1',
  text: 'Folleto'
},
  {
    id: '2',
    text: 'Tabloide'
  }];

export const paginasDefaultData: Select2OptionData[] = [{
  id: '1',
  text: 'Portada'
},
  {
    id: '2',
    text: 'Página 1'
  },{
    id: '3',
    text: 'Página 2'
  },{
    id: '4',
    text: 'Contraportada'
  }];

export const espacioDefaultData: Select2OptionData[] = [
  {id: '1',text: '1'},
  {id: '2',text: '2'},
  {id: '3',text: '3'},
  {id: '4',text: '4'},
  {id: '5',text: '5'},
  {id: '6',text: '6'},
  {id: '7',text: '7'},
  {id: '8',text: '8'}
  ];

export const categoriaDefaultData: Select2OptionData[] = [
  {id: '1',text: 'Categoría 1'},
  {id: '2',text: 'Categoría 2'}
  ];

export const subCategoriaDefaultData: Select2OptionData[] = [
  {id: '1',text: 'Subcategoría 1'},
  {id: '2',text: 'Subcategoría 2'},
  {id: '3',text: 'Subcategoría 3'},
  {id: '4',text: 'Subcategoría 4'}
  ];

export const zonasDefaultData: Select2OptionData[] = [{
  id: '1',
  text: 'Monterrey'
},
  {
    id: '2',
    text: 'Saltillo'
  },{
    id: '3',
    text: 'Tamaulipas'
  }];

export const select2GroupedData: Select2OptionData[] = [{
  id: '1',
  text: 'NFC EAST',
  children: [
    {
      id: '11',
      text: 'Dallas Cowboys'
    },
    {
      id: '12',
      text: 'New York Giants'
    },
    {
      id: '13',
      text: 'Philadelphia Eagles'
    },
    {
      id: '14',
      text: 'Washington Redskins'
    }
  ]
}, {
  id: '2',
  text: 'NFC NORTH',
  children: [
    {
      id: '21',
      text: 'Chicago Bears'
    },
    {
      id: '22',
      text: 'Detroit Lions'
    },
    {
      id: '23',
      text: 'Green Bay Packers'
    },
    {
      id: '24',
      text: 'Minnesota Vikings'
    }
  ]
}, {
  id: '3',
  text: 'NFC SOUTH',
  children: [
    {
      id: '31',
      text: 'Atlanta Falcons'
    },
    {
      id: '32',
      text: 'Carolina Panthers'
    },
    {
      id: '33',
      text: 'New Orleans Saints'
    },
    {
      id: '34',
      text: 'Tampa Bay Buccaneers'
    }
  ]
}];

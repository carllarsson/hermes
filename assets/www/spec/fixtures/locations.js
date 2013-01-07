define([], function () {

  var fixtures = {
    valid: {
      campuses: ["Sveaplan","Kista","Konradsberg","Frescati","Kräftriket"],
      bounds: {
          minLat: 59.32586664408746, 
          maxLat: 59.40853646825391, 
          minLng: 17.938205392915247, 
          maxLng: 18.060504
      },
      locations: [
	      {
	        id:1,
	        campus:'Frescati',
	        type:'parkering',
	        subType:'mc',
	        shape:"line",
	        text:"Foobar",
	        coords:[
	          [59.00, 18.00]
	        ],
	        directionAware:false
	      },
	      {
	        id:2,
	        campus:'Frescati',
	        type:'parkering',
	        subType:'mc',
	        shape:"line",
	        text:"Foobar",
	        coords:[
	          [59.00, 18.00]
	        ],
	        directionAware:false
	      },
	      {
	        id:3,
	        campus:'Frescati',
	        type:'hörsal',
	        subType:'mc',
	        shape:"line",
	        text:"Foobar",
	        coords:[
	          [59.00, 18.00]
	        ],
	        directionAware:false
	      },
	      {
	        id:4,
	        campus:'Kista',
	        type:'parkering',
	        subType:'mc',
	        shape:"line",
	        text:"Foobar",
	        coords:[
	          [59.00, 18.00]
	        ],
	        directionAware:false
	      }
	  ]
    }
  };

  return fixtures;
});

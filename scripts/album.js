var albumPicasso = {
    title: 'The Colors',
    artist: 'Pablo Picasso',
    label: 'Cubism',
    year: '1881',
    albumArtUrl: 'assets/images/album_covers/01.png',
    songs: [
        { title: 'Blue', duration: '4:26' },
        { title: 'Green', duration: '3:14' },
        { title: 'Red', duration: '5:01' },
        { title: 'Pink', duration: '3:21'},
        { title: 'Magenta', duration: '2:15'}
    ]
};
 
var albumMarconi = {
    title: 'The Telephone',
    artist: 'Guglielmo Marconi',
    label: 'EM',
    year: '1909',
    albumArtUrl: 'assets/images/album_covers/20.png',
    songs: [
        { title: 'Hello, Operator?', duration: '1:01' },
        { title: 'Ring, ring, ring', duration: '5:01' },
        { title: 'Fits in your pocket', duration: '3:21'},
        { title: 'Can you hear me now?', duration: '3:14' },
        { title: 'Wrong phone number', duration: '2:15'}
    ]
};

var albumTarek = {
    title: 'The JS Crew',
    artist: 'T-Rex',
    label: 'Pop Music',
    year: '2016',
    albumArtUrl: 'assets/images/album_covers/02.png',
    songs: [
        { title: 'Write me, write me good', duration: '2:42' },
        { title: 'Functions of Love', duration: '3:24' },
        { title: 'The Objects of my Desire', duration: '3:21'},
        { title: 'My light Array', duration: '3:14' },
        { title: 'Programing Forever', duration: '2:15'}
    ]
};

var createSongRow = function(songNumber, songName, songLength) {
    var template =
        '<tr class="album-view-song-item">'
        + '  <td class="song-item-number" data-song-number= "' + songNumber + '">' + songNumber + '</td>'
        + '  <td class="song-item-title">' + songName + '</td>'
        + '  <td class="song-item-duration">' + songLength + '</td>'
        + '</tr>'
        ;
 
    return template;
};

var albumTitle          = document.getElementsByClassName('album-view-title')[0];
var albumArtist         = document.getElementsByClassName('album-view-artist')[0];
var albumReleaseInfo    = document.getElementsByClassName('album-view-release-info')[0];
var albumImage          = document.getElementsByClassName('album-cover-art')[0];
var albumSongList       = document.getElementsByClassName('album-view-song-list')[0];
var songListContainer   = document.getElementsByClassName('album-view-song-list')[0];
var songRows            = document.getElementsByClassName('album-view-song-item');
var playButtonTemplate  = '<a class="album-song-button"><span class="ion-play"></span></a>';

var setCurrentAlbum = function(album) {
    albumTitle.firstChild.nodeValue = album.title;
    albumArtist.firstChild.nodeValue = album.artist;
    albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
    albumImage.setAttribute('src', album.albumArtUrl);
 
    albumSongList.innerHTML = '';
 
    for (var i = 0; i < album.songs.length; i++) {
        albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    }
};

window.onload = function() {
    setCurrentAlbum(albumPicasso);
    songListContainer.addEventListener('mouseover', function(event) {
        //console.log(event.target);
        if (event.target.parentElement.className === 'album-view-song-item') {
            event.target.parentElement.querySelector('.song-item-number').innerHTML = playButtonTemplate;
        }
    });

    for (var i = 0; i < songRows.length; i++) {
        songRows[i].addEventListener('mouseleave', function(event) {
           this.children[0].innerHTML = this.children[0].getAttribute('data-song-number'); 
        });
    }

// When clicking on an album cover, the page toggles between the three album objects.
// so I need to add a mouse click event Listener, then I need to loop through the objects
// problem: upon mouse click the album jumps to albumTarek rather than albumMarconi and stops!!!
// 1- Need to step through albums -- fixed with removing the for loop and replacing it setting i = 1 and 
//                                   incrementing i at the end of the statement.
// 2- Need to go back to albumPicasso when done! How can I resent a loop back to the beginning?!?!
// 2 fixed with adding the if statement at array length and resetting i to 0.
// this is according the to assignment solution video.
    
    var albumObjects = [albumPicasso, albumMarconi, albumTarek];
    var i = 1;
    albumImage.addEventListener('click', function(clickEvent) {
        setCurrentAlbum(albumObjects[i]);
        i++;
        if (i == albumObjects.length) {
            i = 0;
        }
    });
};
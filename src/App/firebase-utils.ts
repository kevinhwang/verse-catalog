import {TaggedPassage} from '../passage-api'
import firebase, {UserInfo} from 'firebase'
import {useFirestore, useFirestoreCollection, useFirestoreDoc, useUser} from 'reactfire'


function usePassageCollectionRef(): firebase.firestore.CollectionReference<TaggedPassage> {
  const userId = useUser<UserInfo>().uid
  const firestore: firebase.firestore.Firestore = useFirestore()
  return firestore
    .collection('profiles')
    .doc(userId)
    .collection('passages') as firebase.firestore.CollectionReference<TaggedPassage>
}

export function usePassageCollection(): [firebase.firestore.CollectionReference<TaggedPassage>, firebase.firestore.QuerySnapshot<TaggedPassage>] {
  const ref = usePassageCollectionRef()
  const querySnapshot = useFirestoreCollection(ref) as unknown as firebase.firestore.QuerySnapshot<TaggedPassage>
  return [ref, querySnapshot]
}

function usePassageRef(id: string): firebase.firestore.DocumentReference<TaggedPassage> {
  const collectionRef = usePassageCollectionRef()
  return collectionRef.doc(id)
}

export function usePassage(id: string): [firebase.firestore.DocumentReference<TaggedPassage>, firebase.firestore.QueryDocumentSnapshot<TaggedPassage>] {
  const ref = usePassageRef(id)
  const queryDocumentSnapshot = useFirestoreDoc(ref) as unknown as firebase.firestore.QueryDocumentSnapshot<TaggedPassage>
  return [ref, queryDocumentSnapshot]
}
